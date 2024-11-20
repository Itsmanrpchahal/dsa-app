// when an action related a post is done, it has to be registered and 3 major things happen:
// 1. segment tracking (usage analytics)
// 2. recombee feed engine feedback
// 3. points are added or deducted for user according to the action

import { recombeeClient } from "../../../config/recombeeClient";
// @ts-ignore
import * as recombee from "recombee-js-api-client";
import { segmentClient } from "../../../config/segmentClient";

export enum ActionType {
    VIEW,
    ELI5,
    DIVE_IN,
    SHARE,
    SOURCE_LINK_VISIT,
    APP_VIEW,
    APP_VISIT,
}

type ActionDetails = {
    name: string;
    description: string;
    segmentEvent: string;
    recombeeFeedback: (postId: string, uuid: string) => void;
    pointsChange?: number;
};

const actions: Record<ActionType, ActionDetails> = {
    [ActionType.VIEW]: {
        name: "View",
        description: "a new post has been viewed",
        segmentEvent: "Post Viewed",
        recombeeFeedback: (postId: string, uuid: string) => {
            recombeeClient.send(
                new recombee.AddDetailView(uuid, postId, {
                    cascadeCreate: true,
                })
            );
        },
    },
    [ActionType.ELI5]: {
        name: "ELI5",
        description: "viewed the eli5 summary",
        segmentEvent: "ELI5 View",
        recombeeFeedback: (postId: string, uuid: string) => {
            recombeeClient.send(new recombee.SetViewPortion(uuid, postId, 0.5));
        },
    },
    [ActionType.DIVE_IN]: {
        name: "Dive In",
        description: "viewed the Dive in section with comments, glossary",
        segmentEvent: "Dive In View",
        recombeeFeedback: (postId: string, uuid: string) => {
            recombeeClient.send(new recombee.SetViewPortion(uuid, postId, 1));
        },
    },
    [ActionType.SHARE]: {
        name: "Share",
        description: "sharing post to external apps",
        segmentEvent: "Share Post",
        recombeeFeedback: (postId: string, uuid: string) => {
            recombeeClient.send(new recombee.AddRating(uuid, postId, 1));
        },
    },
    [ActionType.SOURCE_LINK_VISIT]: {
        name: "Source Link Visit",
        description: "Visited source link",
        segmentEvent: "Open Source Link",
        recombeeFeedback: (postId: string, uuid: string) => {
            recombeeClient.send(new recombee.AddRating(uuid, postId, 0.5));
        },
    },
    [ActionType.APP_VIEW]: {
        name: "App View",
        description: "Viewing app details",
        segmentEvent: "App Opened",
        recombeeFeedback: (postId: string, uuid: string) => {
            recombeeClient.send(new recombee.AddPurchase(uuid, postId));
        },
    },
    [ActionType.APP_VISIT]: {
        name: "App Visit",
        description: "Visiting an app external link",
        segmentEvent: "App Visit",
        recombeeFeedback: () => {},
    },
};

export type RegisterActionProps = {
    action: ActionType;
    postId: string;
    uuid: string;
};

export default async function registerAction({
    action,
    postId,
    uuid,
}: RegisterActionProps): Promise<boolean> {
    try {
        if (!__DEV__) {
            const actionDetails: ActionDetails = actions[action];

            // segment tracking
            await segmentClient.track(actionDetails.segmentEvent, {
                itemId: postId,
                uuid: uuid,
            });

            // recombee feedback
            actionDetails.recombeeFeedback(postId, uuid);

            // points change
        }

        return true;
    } catch (error) {
        console.error("register action error", error);
        return false;
    }
}
