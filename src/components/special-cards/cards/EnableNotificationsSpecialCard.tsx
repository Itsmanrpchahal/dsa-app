import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Linking, Platform, View } from "react-native";
import { SquircleView } from "react-native-figma-squircle";
import { OneSignal } from "react-native-onesignal";
import { HOME_HEADER_HEIGHT } from "../../../config/constants/dimensions";
import { svgIcons } from "../../../config/constants/iconSvgs";
import { responsiveScreenFontSize } from "../../../config/constants/responsiveCalculations";
import { segmentClient } from "../../../config/segmentClient";
import { Text, TextButton, theme } from "../../../ui";
import { Card } from "../../../ui/card";
import { YStack } from "../../../ui/stack";
import { images } from "../../../config/constants/images";

const SpecialCardBody = () => {
    return (
        <YStack
            justifyContent={"center"}
            alignItems={"center"}
            width={"auto"}
            style={{
                flex: 1,
                padding: theme.spacing.$4,
                justifyContent: "space-between",
            }}
            gap={Platform.OS === "ios" ? theme.spacing.$10 : theme.spacing.$0}
        >
            <Image
                style={{
                    width:
                        Platform.OS === "ios"
                            ? 180
                            : responsiveScreenFontSize(20),
                    height:
                        Platform.OS === "ios"
                            ? 180
                            : responsiveScreenFontSize(20),
                }}
                source={images.chatIcon}
            />
            <YStack
                justifyContent={"center"}
                alignItems={"center"}
                width={null}
                gap={theme.spacing.$2}
            >
                <Text
                    variant="heading_large_italic"
                    color={"content_primary"}
                    style={{
                        textAlign: "center",
                    }}
                >
                    🌟 Tap 'Enable' for Trend Alerts! 🌟
                </Text>
                <Text
                    variant="body_small"
                    color={"content_primary"}
                    style={{
                        opacity: 1,
                        textAlign: "center",
                    }}
                >
                    Get notified, stay excited! :star2: Enable notifications and
                    receive real-time updates on the latest dApp drops and alpha
                    leaks. Never miss a trend again! 📈 🔔
                </Text>
            </YStack>
            <Card
                trackingName=""
                color={theme.colors.content_primary + "05"}
                blur={true}
                borderRadius={theme.spacing.$3}
            >
                <TextButton
                    trackingName="Enable Notifications Special Card Button Clicked"
                    label={"Enable"}
                    onPress={() => {
                        Linking.openSettings();
                    }}
                    buttonColor={theme.colors.transparent}
                    labelColor={theme.colors.content_1}
                    small={true}
                    icon={svgIcons.notificationsIcon}
                />
            </Card>
        </YStack>
    );
};

export const EnableNotificationsSpecialCard = () => {
    const tabBarHeight = useBottomTabBarHeight();
    const postPadding = theme.spacing.$10;
    const cardHeight =
        theme.dimensions.fullHeight -
        HOME_HEADER_HEIGHT -
        tabBarHeight -
        postPadding +
        20;
    const [areNotificationsEnabled, setAreNotificationsEnabled] =
        useState<boolean>(true);

    useEffect(() => {
        const checkNotificationPermission = async () => {
            const permission = await OneSignal.Notifications.hasPermission();
            setAreNotificationsEnabled(permission);
        };

        checkNotificationPermission();
    }, []);

    if (areNotificationsEnabled) {
        return null;
    }

    useEffect(() => {
        // analytics
        segmentClient.track("Enable Notifications Special Card Viewed");
    }, []);

    return (
        <View style={{ flex: 1, height: theme.dimensions.fullHeight }}>
            <SquircleView
                squircleParams={{
                    cornerSmoothing: 1,
                    cornerRadius: theme.spacing.$5,
                    fillColor: theme.colors.base_primary + "50",
                }}
                style={{
                    width: theme.dimensions.fullWidth * 0.95,
                    marginTop: HOME_HEADER_HEIGHT,
                    marginBottom: postPadding / 2,
                    height: cardHeight,
                    alignSelf: "center",
                }}
            >
                <SpecialCardBody />
            </SquircleView>
        </View>
    );
};
