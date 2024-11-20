import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { PostCard } from "../components";
import { segmentClient } from "../config/segmentClient";
import { getOnePostDetails } from "../helpers/feed/api/getOnePostDetails";
import { Text, theme } from "../ui";
import { ModalScreen, PlainStackScreen } from "../ui/screens";
import { YStack } from "../ui/stack";

export default function ViewPostScreen({
    // @ts-ignore
    route,
    // @ts-ignore
    navigation,
}) {
    const postId = route.params.postId;

    const [postDetails, setPostDetails] = useState<any>(null);
    const [postLoadingStatus, setPostLoadingStatus] = useState<
        "loading" | "done" | "failed"
    >("loading");

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const res = await getOnePostDetails(postId);
                const post = {
                    id: postId,
                    values: res,
                };

                setPostDetails(post);
                setPostLoadingStatus("done");
            } catch (err) {
                setPostLoadingStatus("failed");
            }
        };

        fetchPostDetails();
    }, []);

    if (postLoadingStatus === "loading") {
        return (
            <ModalScreen trackingName="View Post Screen">
                <YStack
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={null}
                    gap={70}
                    style={{
                        flex: 1,
                    }}
                >
                    <ActivityIndicator
                        size="large"
                        color={theme.colors.color_2}
                    />
                </YStack>
            </ModalScreen>
        );
    }

    if (postLoadingStatus === "failed") {
        return (
            <ModalScreen trackingName="View Post Screen">
                <YStack
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={null}
                    gap={70}
                    style={{
                        flex: 1,
                    }}
                >
                    <Text variant="body_small" color={"negative"}>
                        Something went wrong! Post details not available.
                    </Text>
                </YStack>
            </ModalScreen>
        );
    }

    return (
        <PlainStackScreen trackingName="View Post Screen">
            <YStack
                justifyContent={"center"}
                alignItems={"center"}
                width={null}
                gap={70}
                style={{
                    flex: 1,
                }}
            >
                <PostCard
                    post={postDetails}
                    height={theme.dimensions.fullHeight * 0.8}
                    noTopPadding={true}
                />
            </YStack>
        </PlainStackScreen>
    );
}
