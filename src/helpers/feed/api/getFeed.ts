import { recombeeClient } from "../../../config/recombeeClient";
import { useFeedState } from "../../../state/feedState";
import { useUserState } from "../../../state/userState";
// @ts-ignore
import { DdLogs } from "@datadog/mobile-react-native";
import _ from "lodash";
import * as recombee from "recombee-js-api-client";
import { log } from "../../../config/logger";

// Defining constants for better readability and maintenance
const MAX_NEW_POSTS = 30;
const MAX_OLD_POSTS = 10;
const POST_THRESHOLD = 5;
const MAX_FEED_LENGTH = 60;
const REMOVE_POSTS_COUNT = 10;

const fetchPostsFromRecombee = async (
    userUuid: string,
    scenarioName: string,
    forced: boolean,
    maxPosts: number
): Promise<any[]> => {
    const result = await recombeeClient.send(
        new recombee.RecommendItemsToUser(userUuid, maxPosts, {
            cascadeCreate: true,
            scenario: scenarioName,
            returnProperties: true,
            rotationRate: forced ? 0.5 : 1,
        })
    );

    return result.recomms;
};

function updateFeedState(newFeed: any[], date: string | null): void {
    useFeedState.getState().setFeed({
        lastFetched: date,
        feed_posts: newFeed,
    });
}

export async function getFeed(forced = false): Promise<any[]> {
    const userUuid = useUserState.getState().userDetails.uuid;

    if (!userUuid || typeof userUuid !== "string") {
        log.error("Invalid UUID: Exiting getFeed function");
        return [];
    }

    const { lastFetched, feed_posts: existingFeedPosts } =
        useFeedState.getState().feed;

    const today = new Date();
    const todayDateString = today.toISOString().substring(0, 10);

    try {
        if (lastFetched === null || existingFeedPosts.length < POST_THRESHOLD) {
            log.info("Fetching feed for the first time or for a new user");

            const newItems = await fetchPostsFromRecombee(
                userUuid,
                "NewPosts",
                forced,
                MAX_NEW_POSTS
            );
            const oldItems = await fetchPostsFromRecombee(
                userUuid,
                "OnlyPosts",
                forced,
                MAX_OLD_POSTS
            );
            const newFeed = _.unionBy(newItems, oldItems, "id");
            // Loop over newFeed and add each id to unseen posts
            newFeed.forEach((item: any) => {
                useFeedState.getState()?.addUnseenPost?.(item.id);
            });
            updateFeedState(newFeed, todayDateString);

            return newFeed ?? [];
        } else {
            log.info("Returning user, fetching new feed again");

            const recommendedItems = await fetchPostsFromRecombee(
                userUuid,
                "NewPosts",
                forced,
                MAX_NEW_POSTS
            );

            if (existingFeedPosts.length > MAX_FEED_LENGTH) {
                log.info("Reducing feed size by removing older posts");
                existingFeedPosts.splice(
                    -REMOVE_POSTS_COUNT,
                    REMOVE_POSTS_COUNT
                );
            }

            const newFeed = _.unionBy(
                recommendedItems,
                existingFeedPosts,
                "id"
            );

            const newUnseenPosts = _.differenceBy(
                newFeed,
                existingFeedPosts,
                "id"
            );
            // Loop over newUnseenPosts and add each id to unseen posts
            newUnseenPosts.forEach((item: any) => {
                useFeedState.getState()?.addUnseenPost?.(item.id);
            });

            updateFeedState(newFeed, todayDateString);

            return newFeed ?? [];
        }
    } catch (error) {
        log.error("Error fetching feed:", error);
        DdLogs.error("Error fetching feed", { error });
        updateFeedState(existingFeedPosts, lastFetched);
        return [];
    }
}
