import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Platform, View } from "react-native";
import { SquircleView } from "react-native-figma-squircle";
import { PostCardProps } from "..";
import { HOME_HEADER_HEIGHT } from "../../../../config/constants/dimensions";
import { images } from "../../../../config/constants/images";
import { useHomeStackNavigation } from "../../../../navigation/types";
import { useUserState } from "../../../../state/userState";
import { TextButton, theme } from "../../../../ui";
import { SquircleImage } from "../../../../ui/image";
import { YStack } from "../../../../ui/stack";
import { AppSuggestions, TextPostBody } from "../bits";
import { log } from "../../../../config/logger";
import { responsiveScreenHeight } from "../../../../config/constants/responsiveCalculations";

export const TextPost = ({ post, height, noTopPadding }: PostCardProps) => {
    const navigation = useHomeStackNavigation();
    const tabBarHeight = !noTopPadding ? useBottomTabBarHeight() : 0;
    const postPadding = theme.spacing.$4;
    const postHeight = noTopPadding
        ? theme.dimensions.fullHeight - HOME_HEADER_HEIGHT
        : theme.dimensions.fullHeight -
          HOME_HEADER_HEIGHT -
          tabBarHeight -
          postPadding;
    const bodyHeight = postHeight;

    const Body = () => {
        return (
            <SquircleView
                squircleParams={{
                    cornerSmoothing: 1,
                    cornerRadius: theme.spacing.$5,
                    fillColor: theme.colors.base_primary + "50",
                }}
                style={{
                    flex: 1,
                    width: theme.dimensions.fullWidth * 0.95,
                }}
            >
                <YStack
                    justifyContent={"flex-start"}
                    alignItems={"center"}
                    width={null}
                    style={{
                        flex: 1,
                        paddingBottom: theme.spacing.$2,
                        paddingHorizontal: theme.spacing.$5,
                    }}
                >
                    <SquircleImage
                        source={post?.values?.content_img_url ?? ""}
                        contentFit={"cover"}
                        width={theme.dimensions.fullWidth * 0.95}
                        height={responsiveScreenHeight(25)}
                        placeholder={images.blurImagePlaceholder}
                    />
                    <TextPostBody
                        summary={post?.values?.summary ?? ""}
                        glossary={post?.values?.glossary}
                        postData={post}
                        bodyHeight={bodyHeight}
                    />
                    <AppSuggestions
                        appsIds={[
                            post?.values?.suggested_app_1,
                            post?.values?.suggested_app_2,
                            post?.values?.suggested_app_3,
                        ]}
                        itemId={post?.id ?? ""}
                        uuid={useUserState.getState().userDetails.uuid ?? ""}
                    />
                </YStack>
            </SquircleView>
        );
    };
    return (
        <View
            style={{
                flex: 1,
                height: theme.dimensions.fullHeight,
            }}
        >
            <YStack
                justifyContent={noTopPadding ? "space-between" : "center"}
                alignItems={"center"}
                width={null}
                style={{
                    marginTop: HOME_HEADER_HEIGHT,
                    marginBottom: noTopPadding
                        ? tabBarHeight / 2
                        : tabBarHeight,
                    height: noTopPadding ? height : postHeight,
                }}
                gap={theme.spacing.$5}
            >
                <Body />
                {noTopPadding && (
                    <TextButton
                        trackingName="Closed Notification Post To Go Home"
                        trackingParameters={{
                            postId: post?.id,
                        }}
                        label="Go Home"
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
