import { MEROKU_API_HOST } from "@env";
import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { segmentClient } from "../../../../config/segmentClient";
import { getAppDetails } from "../../../../helpers/feed";
import { useCurrentTabState } from "../../../../state/currentTabState";
import { Text, theme } from "../../../../ui";
import { YStack, ZStack } from "../../../../ui/stack";
import { Clickable } from "../../../../ui/clickable";
import { SquircleView } from "react-native-figma-squircle";
import { SquircleImage } from "../../../../ui/image";

export type TrendingThumbnailProps = {
    appId: string;
    hot: boolean;
    airdrop?: boolean;
} & Record<string, any>;

const appDetailsCache: { [appId: string]: any } = {};

export default function TrendingThumbnail(props: TrendingThumbnailProps) {
    const styles = StyleSheet.create({
        shadowProps: {
            shadowColor: theme.colors.base_primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 3,
        },
    });
    const [appDetails, setAppDetails] = useState<any>(null);
    const [prevAppDetails, setPrevAppDetails] = useState<any>(null);

    // Function to fetch app details immediately
    const fetchAppDetails = useCallback(async () => {
        if (!appDetailsCache[props.appId]) {
            const details = await getAppDetails(props.appId);
            appDetailsCache[props.appId] = details[0];
            setPrevAppDetails(appDetails);
            setAppDetails(appDetailsCache[props.appId]);
        } else {
            setPrevAppDetails(appDetails);
            setAppDetails(appDetailsCache[props.appId]);
        }
    }, [props.appId]);

    useEffect(() => {
        fetchAppDetails();
    }, [fetchAppDetails]);

    return (
        <Clickable
            trackingName="Playlist App Thumbnail Clicked"
            trackingParameters={{ appId: props.appId, playlist: "Trending" }}
            onPress={() => {
                segmentClient.track("Clicked On Trending App Thumbnails", {
                    appId: props.appId,
                });
                useCurrentTabState.getState().setCurrentTab({
                    url: `${MEROKU_API_HOST}/o/view/${props.appId}?userId=anon_dsa`,
                    hostname: appDetails?.name?.toLowerCase(),
                    hostNameUrl: `${MEROKU_API_HOST}`,
                });
            }}
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
                <ZStack
                    width={50}
                    height={50}
                    style={{ justifyContent: "center", alignItems: "center" }}
                >
                    <SquircleImage
                        style={{
                            width: theme.spacing.$9,
                            height: theme.spacing.$9,
                            backgroundColor: theme.colors.base_primary + "75",
                            ...styles.shadowProps,
                        }}
                        contentFit="cover"
                        transition={prevAppDetails === appDetails ? 0 : 1000}
                        source={appDetails?.images?.logo ?? ""}
                        placeholder={require("../../../../../assets/blur-image-placeholder.png")}
                        cornerRadius={theme.spacing.$2}
                    />

                    {props.airdrop && (
                        <Text
                            variant="body_large"
                            color="light"
                            textAlign={"right"}
                            style={{
                                position: "absolute",
                                right: 0,
                                bottom: 0,
                            }}
                        >
                            🪂
                        </Text>
                    )}
                    {props.hot && (
                        <Text
                            variant="body_large"
                            color="light"
                            textAlign={"right"}
                            style={{
                                position: "absolute",
                                right: 0,
                                bottom: 0,
                            }}
                        >
                            {props.airdrop ? "🪂" : "🔥"}
                        </Text>
                    )}
                </ZStack>
                <Text
                    variant="body_small"
                    color="light"
                    numberOfLines={2}
                    textAlign={"center"}
                >
                    {appDetails?.name?.length > 13
                        ? appDetails?.name?.substring(0, 13) + "..." ??
                          "loading"
                        : appDetails?.name ?? "loading"}
                </Text>
            </YStack>
        </Clickable>
    );
}
