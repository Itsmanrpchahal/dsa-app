import MaskedView from "@react-native-masked-view/masked-view";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { ImageBackground, Image } from "expo-image";
import { View } from "react-native";
import { SquircleView } from "react-native-figma-squircle";
import { PostCardProps } from "..";
import {
    APP_SUGGESTIONS_HEIGHT,
    HOME_HEADER_HEIGHT,
} from "../../../../config/constants/dimensions";
import { useUserState } from "../../../../state/userState";
import { TextButton, theme } from "../../../../ui";
import { XStack, YStack, ZStack } from "../../../../ui/stack";
import { AppSuggestions, PostTitle } from "../bits";
import { sharePost } from "../../../../helpers/share/misc/sharePost";
import { useHomeStackNavigation } from "../../../../navigation/types";
import { segmentClient } from "../../../../config/segmentClient";
import { images } from "../../../../config/constants/images";
import { Clickable } from "../../../../ui/clickable";
import { LinearGradient } from "expo-linear-gradient";

export const SmallImagePost = ({
    post,
    height,
    noTopPadding,
}: PostCardProps) => {
    const navigation = useHomeStackNavigation();
    const tabBarHeight = !noTopPadding ? useBottomTabBarHeight() : 0;
    const postPadding = theme.spacing.$10;
    const postHeight = noTopPadding
        ? theme.dimensions.fullHeight - HOME_HEADER_HEIGHT - 80 - postPadding
        : theme.dimensions.fullHeight -
          HOME_HEADER_HEIGHT -
          tabBarHeight -
          postPadding;
    const bodyHeight = postHeight - APP_SUGGESTIONS_HEIGHT;

    const Body = () => {
        return (
            <ZStack
                width={"100%"}
                // height={"auto"}
                height={bodyHeight}
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "visible",
                }}
            >
                <MaskedView
                    style={{
                        width: theme.dimensions.fullWidth * 0.95,
                        height: theme.dimensions.fullWidth * 0.95,
                        position: "absolute",
                    }}
                    maskElement={
                        <SquircleView
                            squircleParams={{
                                cornerSmoothing: 1,
                                cornerRadius: theme.spacing.$2,
                                fillColor: theme.colors.base_1,
                            }}
                            style={{
                                flex: 1,
                            }}
                        />
                    }
                >
                    <ImageBackground
                        source={{
                            uri: post?.values?.content_img_url ?? "",
                        }}
                        placeholder={images.blurImagePlaceholder}
                        style={{
                            width: theme.dimensions.fullWidth * 0.95,
                            height: theme.dimensions.fullWidth * 0.95,
                            justifyContent: "flex-end",
                        }}
                    >
                        <LinearGradient
                            colors={[
                                theme.colors.base_primary + 10,
                                theme.colors.base_primary + 50,
                                theme.colors.base_primary,
                            ]}
                            style={{ padding: theme.spacing.$3 }}
                        >
                            <XStack
                                justifyContent={"space-between"}
                                alignItems={"center"}
                                width={"100%"}
                                gap={theme.spacing.$2}
                            >
                                <PostTitle
                                    external_url={
                                        post?.values?.external_url ?? ""
                                    }
                                    title={post?.values?.title ?? ""}
                                    postId={post?.id}
                                />
                                <Clickable
                                    trackingName="Share Post Clicked In Small Image Post"
                                    trackingParameters={{
                                        postId: post?.id,
                                    }}
                                    onPress={() =>
                                        sharePost(
                                            post?.id,
                                            post?.values?.title ?? ""
                                        )
                                    }
                                >
                                    <Image
                                        style={{ width: 25, height: 25 }}
                                        source={images.postShareIcon}
                                    />
                                </Clickable>
                            </XStack>
                        </LinearGradient>
                    </ImageBackground>
                </MaskedView>
            </ZStack>
        );
    };

    return (
        <View style={{ flex: 1, height: theme.dimensions.fullHeight }}>
            <YStack
                justifyContent={"center"}
                alignItems={"center"}
                width={null}
                style={{
                    marginTop: HOME_HEADER_HEIGHT + postPadding / 2,
                    marginBottom: postPadding / 2,
                    height: postHeight,
                }}
                gap={noTopPadding ? theme.spacing.$5 : 0}
            >
                <Body />
                <View
                    style={{
                        paddingHorizontal: theme.spacing.$5,
                    }}
                >
                    <AppSuggestions
                        appsIds={[
                            post?.values?.suggested_app_1,
                            post?.values?.suggested_app_2,
                            post?.values?.suggested_app_3,
                        ]}
                        itemId={post?.id ?? ""}
                        uuid={useUserState.getState().userDetails.uuid ?? ""}
                    />
                </View>
                {noTopPadding && (
                    <TextButton
                        trackingName="Closed Notification Post To Go Home"
                        trackingParameters={{
                            postId: post?.id,
                        }}
                        label="close"
                        buttonColor={theme.colors.base_1}
                        labelColor={theme.colors.content_1}
                        small={true}
                        onPress={() => {
                            navigation.navigate("AppTabs");
                        }}
                    />
                )}
            </YStack>
        </View>
    );
};
