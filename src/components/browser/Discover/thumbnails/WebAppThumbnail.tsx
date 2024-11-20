import { Image } from "expo-image";
import { processUrl } from "../../../../helpers/browser/misc/processUrl";
import { useCurrentTabState } from "../../../../state/currentTabState";
import { Text, theme } from "../../../../ui";
import { XStack, YStack } from "../../../../ui/stack";
import { segmentClient } from "../../../../config/segmentClient";
import { images } from "../../../../config/constants/images";
import { Clickable } from "../../../../ui/clickable";
import { SquircleView } from "react-native-figma-squircle";
import { StyleSheet } from "react-native";
import { SquircleImage } from "../../../../ui/image";

export type WebAppThumbnailProps = {
    appId: string;
    name: string;
    appUrl: string;
    images: {
        logo?: string; // Add the 'logo' property to the 'images' object type
    };
} & Record<string, any>;

export default function WebAppThumbnail(props: WebAppThumbnailProps) {
    const styles = StyleSheet.create({
        shadowProps: {
            shadowColor: theme.colors.base_primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 3,
        },
    });
    if (
        props.images?.logo === undefined ||
        props.name === undefined ||
        props.name.length === 0
    ) {
        return null;
    }

    return (
        <Clickable
            trackingName="Recents App Thumbnail Clicked"
            trackingParameters={{ appId: props.appId }}
            onPress={() => {
                const processedUrl = processUrl(props.appUrl);
                segmentClient.track("Clicked On Browser App Thumbnails", {
                    url: processedUrl.url,
                });
                useCurrentTabState.getState().setCurrentTab(processedUrl);
            }}
        >
            <XStack
                justifyContent="flex-start"
                alignItems="center"
                width={theme.dimensions.fullWidth * 0.33}
            >
                <YStack
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={theme.dimensions.fullWidth * 0.33}
                    gap={theme.spacing.$2}
                    style={{
                        height: "100%",
                        paddingVertical: theme.spacing.$2,
                        paddingHorizontal: theme.spacing.$2,
                    }}
                >
                    <SquircleImage
                        style={{
                            width: theme.spacing.$9,
                            height: theme.spacing.$9,
                            backgroundColor: theme.colors.base_primary + "75",
                            ...styles.shadowProps,
                        }}
                        contentFit="cover"
                        transition={1000}
                        source={props.images?.logo ?? ""}
                        placeholder={require("../../../../../assets/blur-image-placeholder.png")}
                        cornerRadius={theme.spacing.$2}
                    />

                    <Text
                        variant="body_small"
                        color="light"
                        numberOfLines={2}
                        textAlign={"center"}
                    >
                        {props?.name?.length > 13
                            ? props.name.substring(0, 13) + "..." ?? "loading"
                            : props.name ?? "loading"}
                    </Text>
                </YStack>
            </XStack>
        </Clickable>
    );
}
