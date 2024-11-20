import { Platform, Share } from "react-native";
import * as Burnt from "burnt";
import { PUBLIC_APP_NAME } from "@env";
import registerAction, { ActionType } from "../../feed/misc/registerAction";
import { useUserState } from "../../../state/userState";

export function sharePost(postId: string, postTitle: string) {
    if (!postId) {
        Burnt.toast({
            title: "Error trying to share post",
            preset: "error",
        });
    }

    const sharePostUrl = `https://share.dappstore.app/posts/${postId}`;

    registerAction({
        action: ActionType.VIEW,
        postId: String(postId),
        uuid: useUserState.getState().userDetails.uuid!,
    });

    Share.share(
        {
            message:
                Platform.OS === "android"
                    ? `Explore ${postTitle} on ${PUBLIC_APP_NAME} and stay ahead of the curve in Web3 and AI ${sharePostUrl}. Your deep dive starts here:`
                    : `Explore ${postTitle} on ${PUBLIC_APP_NAME} and stay ahead of the curve in Web3 and AI. Your deep dive starts here:`,
            url: sharePostUrl,
            title: `Trending on ${PUBLIC_APP_NAME} App`,
        },
        {
            dialogTitle: `Share ${PUBLIC_APP_NAME} Post`,
            tintColor: "green",
        }
    );
}
