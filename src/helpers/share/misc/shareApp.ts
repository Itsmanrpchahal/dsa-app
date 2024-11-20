import { PUBLIC_APP_NAME } from "@env";
import { Platform, Share } from "react-native";
import { segmentClient } from "../../../config/segmentClient";

export function shareApp() {
    const shareAppUrl = `https://share.dappstore.app`;

    segmentClient.track("Share App Action", {
        withInviteCode: false,
        source: "Profile Screen",
    });

    Share.share(
        {
            message:
                Platform.OS === "android"
                    ? `Explore ${PUBLIC_APP_NAME}: Where AI-driven recommendations meet exclusive Web3 apps. Earn points and enjoy privacy-first discovery! Join me now ${shareAppUrl}`
                    : `Explore ${PUBLIC_APP_NAME}: Where AI-driven recommendations meet exclusive Web3 apps. Earn points and enjoy privacy-first discovery! Join me now`,
            url: shareAppUrl,
            title: PUBLIC_APP_NAME,
        },
        {
            dialogTitle: `Share ${PUBLIC_APP_NAME}`,
            tintColor: "blue",
        }
    );
}
