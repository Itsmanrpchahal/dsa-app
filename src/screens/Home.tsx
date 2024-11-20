import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useState } from "react";
import { LayoutChangeEvent, Platform } from "react-native";
import { HomeHeader, PostCard } from "../../src/components";
import { Text, TextButton, theme } from "../../src/ui";
import { InviteAndEarnSpecialCard } from "../components/special-cards";
import { EnableNotificationsSpecialCard } from "../components/special-cards/cards/EnableNotificationsSpecialCard";
import { TryChatSpecialCard } from "../components/special-cards/cards/TryChatSpecialCard";
import { log } from "../config/logger";
import { segmentClient } from "../config/segmentClient";
import { getFeed } from "../helpers/feed";
import { useHomeStackNavigation } from "../navigation/types";
import { useFeedState } from "../state/feedState";
import { useHelpShowState } from "../state/helpShowState";
import { PostType } from "../types";
import { TabStackScreen } from "../ui/screens";
import { YStack, ZStack } from "../ui/stack";

type SpecialCard = {
    type: "special-card";
    id: string;
    component: JSX.Element;
};

const specialCards: SpecialCard[] = [
    {
        type: "special-card",
        id: "invite-and-earn",
        component: <InviteAndEarnSpecialCard />,
    },
    {
        type: "special-card",
        id: "enable-notifications",
        component: <EnableNotificationsSpecialCard />,
    },
];

export default function HomeScreen() {
    const feed = useFeedState.getState().feed;
    const [feedPosts, setFeedPosts] = useState<any[]>([]);

    useEffect(() => {
        // const feed = { lastFetched: null, feed_posts: [] };
        if (!feed || !feed.feed_posts || feed.feed_posts.length === 0) {
            setFeedPosts([]);
        }

        const unSeenPosts = useFeedState.getState()?.unSeenPosts;
        type SortedFeed = {
            unSeenPosts: PostType[];
            seenPosts: PostType[];
        };
        const sortedFeedBasedOnReadPosts = unSeenPosts?.length
            ? feed.feed_posts.reduce(
                  (
                      sortedFeed: SortedFeed = {
                          unSeenPosts: [],
                          seenPosts: [],
                      },
                      post
                  ) => {
                      if (unSeenPosts.includes(post.id)) {
                          sortedFeed.unSeenPosts.push(post);
                      } else {
                          sortedFeed.seenPosts.push(post);
                      }
                      return sortedFeed;
                  },
                  { unSeenPosts: [], seenPosts: [] }
              )
            : { unSeenPosts: feed.feed_posts, seenPosts: [] };

        const mergedFeedPosts = [
            ...sortedFeedBasedOnReadPosts.unSeenPosts,
            ...sortedFeedBasedOnReadPosts.seenPosts,
        ];

        if (specialCards.length === 0) {
            setFeedPosts(mergedFeedPosts ?? []);
        }

        const feedPosts = mergedFeedPosts;
        const newFeedPosts = [];

        for (let i = 0; i < feedPosts.length; i++) {
            newFeedPosts.push(feedPosts[i]);
            if ((i + 1) % 5 === 0) {
                newFeedPosts.push(specialCards[Math.floor(i / 5)]);
            }
        }

        setFeedPosts(newFeedPosts);
    }, [feed]);

    return (
        <TabStackScreen trackingName="Home Screen">
            <YStack
                justifyContent={"flex-start"}
                alignItems={"center"}
                width={"100%"}
            >
                <HomeHeader />
                <FeedList feed={feedPosts} />
            </YStack>
        </TabStackScreen>
    );
}

function FeedList({ feed }: { feed: any[] }) {
    const [postHeight, setPostHeight] = useState(100);
    const [feedToBeRendered, setFeedToBeRendered] = useState<any[]>([]);

    const onContainerLayout = (event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout;

        setPostHeight(height);
    };

    const navigation = useHomeStackNavigation();

    useEffect(() => {
        Platform.OS === "android" &&
            setTimeout(() => {
                if (!useHelpShowState.getState().helpShown.appHelpShown) {
                    navigation.navigate("HelpScreen");
                }
            }, 3000);
    }, []);

    useEffect(() => {
        setFeedToBeRendered(feed);
    }, [feed]);

    if (feed.length === 0 && postHeight > 100) {
        // anayltics
        segmentClient.track("No posts available");

        return (
            <YStack
                justifyContent={"center"}
                alignItems={"center"}
                width={"100%"}
                style={{
                    flex: 1,
                    minHeight:
                        Platform.OS === "android"
                            ? "100%"
                            : theme.dimensions.fullHeight,
                }}
                gap={theme.spacing.$10}
            >
                <Text variant="heading_small" color="light">
                    No posts available
                </Text>
                <TextButton
                    trackingName="Refresh Posts Button Clicked"
                    onPress={() => getFeed(true)}
                    label={"refresh"}
                    buttonColor={theme.colors.base_1}
                    labelColor={theme.colors.content_1}
                />
            </YStack>
        );
    } else {
        return (
            <ZStack
                onLayout={onContainerLayout}
                width={theme.dimensions.fullWidth}
                height={theme.dimensions.fullHeight}
            >
                <FlashList
                    data={feedToBeRendered}
                    renderItem={(post) =>
                        post?.item?.type === "special-card" ? (
                            post?.item?.component
                        ) : post?.item?.id && post?.item?.values ? (
                            <PostCard
                                post={post.item}
                                height={postHeight}
                                noTopPadding={false}
                            />
                        ) : null
                    }
                    onViewableItemsChanged={(viewableItems) => {
                        const seenPosts = viewableItems?.viewableItems?.map(
                            (item) => item?.item?.id
                        );
                        seenPosts.forEach((id) => {
                            useFeedState.getState()?.removeUnseenPost?.(id);
                        });
                    }}
                    estimatedItemSize={theme.dimensions.fullHeight}
                    snapToInterval={theme.dimensions.fullHeight}
                    snapToAlignment="center"
                    decelerationRate={"fast"}
                    pagingEnabled={true}
                    showsVerticalScrollIndicator={false}
                    initialScrollIndex={0}
                    ListFooterComponent={() => <TryChatSpecialCard />}
                />
            </ZStack>
        );
    }
}
