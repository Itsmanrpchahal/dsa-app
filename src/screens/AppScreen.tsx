import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AppHeader from "../components/app/AppHeader";
import { AppScreenshots } from "../components/app/AppScreenshots";
import { segmentClient } from "../config/segmentClient";
import { getAppDetails } from "../helpers/feed";
import { HomeStackNavigationProp } from "../navigation/types";
import { Text, TextButton, theme } from "../ui";
import { ModalScreen } from "../ui/screens";
import { YStack } from "../ui/stack";
import { useRecentlyViewedAppsState } from "../state/recentsViewedAppsState";
import { useCurrentTabState } from "../state/currentTabState";
import { MEROKU_API_HOST } from "@env";
import { LinearGradient } from "expo-linear-gradient";
import ReadMore from "@fawazahmed/react-native-read-more";

export default function AppScreen({
    // @ts-ignore
    route,
    // @ts-ignore
    navigation,
}: HomeStackNavigationProp) {
    const { appDetails: initialAppDetails, appId, source } = route.params;
    const [appDetails, setAppDetails] = useState(initialAppDetails);
    const [isLoading, setIsLoading] = useState(!initialAppDetails);

    useEffect(() => {
        async function fetchAppDetails() {
            if (appId && !initialAppDetails) {
                setIsLoading(true);
                const fetchedDetails = await getAppDetails(appId);
                setAppDetails(fetchedDetails[0]);
                setIsLoading(false);
            }
        }

        fetchAppDetails();
    }, [appId, initialAppDetails]);

    const styles = StyleSheet.create({
        blur_view: {
            flex: 1,
            alignItems: "center",
            position: "relative",
        },
        gradientStyle: {
            width: theme.dimensions.fullWidth,
            alignItems: "center",
            justifyContent: "center",
            bottom: theme.spacing.$0,
            position: "absolute",
            paddingVertical: theme.spacing.$4,
        },
    });

    useEffect(() => {
        useRecentlyViewedAppsState.getState().addNewAppToRecentlyViewedApps({
            appId: appDetails?.dappId ?? "",
            name: appDetails?.name ?? "",
            appUrl: appDetails?.appUrl ?? "",
            images: appDetails?.images ?? {},
            ...appDetails,
        });
    }, []);

    if (isLoading) {
        return (
            <ModalScreen trackingName="App Screen" style={styles.blur_view}>
                <YStack
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={null}
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

    if (!appDetails || !appDetails.name || !appDetails.appUrl) {
        return (
            <ModalScreen trackingName="App Screen" style={styles.blur_view}>
                <YStack
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={null}
                    style={{
                        flex: 1,
                    }}
                >
                    <Text variant="body_small" color={"negative"}>
                        Something went wrong! App details not available.
                    </Text>
                </YStack>
            </ModalScreen>
        );
    }

    return (
        <ModalScreen trackingName="App Screen" style={[styles.blur_view]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <YStack
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={theme.dimensions.fullWidth}
                    gap={20}
                    style={{
                        marginTop: theme.spacing.$2,
                        marginBottom: 120,
                        paddingHorizontal: theme.spacing.$4,
                    }}
                >
                    <AppHeader
                        appName={appDetails.name}
                        appRating={appDetails.metrics?.rating}
                        appVisits={appDetails.metrics?.visits}
                        appCategory={
                            appDetails.category
                                ? appDetails.category.toUpperCase()
                                : ""
                        }
                        appLogoUrl={appDetails.images?.logo ?? ""}
                    />
                    <ReadMore
                        numberOfLines={3}
                        seeMoreText="more"
                        seeLessText="less"
                        seeMoreStyle={{ color: theme.colors.color_blue }}
                        seeLessStyle={{ color: theme.colors.color_blue }}
                        style={{
                            ...theme.textVariants.body_small,
                            color: theme.colors.content_1,
                        }}
                        allowFontScaling={
                            Platform.OS === "android" ? false : true
                        }
                    >
                        {appDetails.description ?? ""}
                    </ReadMore>
                    <AppScreenshots
                        appScreenshots={
                            (appDetails.images?.mobileScreenshots || [])
                                .length > 0
                                ? appDetails.images?.mobileScreenshots
                                : (appDetails.images?.screenshots || [])
                                      .length > 0
                                ? appDetails.images?.screenshots
                                : []
                        }
                    />
                </YStack>
            </ScrollView>
            <LinearGradient
                colors={[
                    theme.colors.base_primary + 10,
                    theme.colors.base_primary + 50,
                    theme.colors.base_primary,
                ]}
                style={styles.gradientStyle}
            >
                <TextButton
                    onPress={() => {
                        // open the app
                        // WebBrowser.openBrowserAsync(
                        //     `https://api.meroku.store/api/v1/o/view/${appId}?userId=anon_dsa`
                        // );

                        useCurrentTabState.getState().setCurrentTab({
                            url: `${MEROKU_API_HOST}/o/view/${appDetails.dappId}?userId=anon_dsa`,
                            hostname: appDetails.name.toLowerCase(),
                            hostNameUrl: `${MEROKU_API_HOST}`,
                        });
                        navigation.navigate("BrowserStack");
                    }}
                    trackingName="App Visited"
                    trackingParameters={{
                        appId: appDetails.dappId,
                        appName: appDetails.name,
                    }}
                    label={"Open App"}
                    buttonColor={theme.colors.brand_green_primary}
                    labelColor={theme.colors.base_primary}
                />
            </LinearGradient>
        </ModalScreen>
    );
}
