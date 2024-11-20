import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Image } from "expo-image";
import { useEffect } from "react";
import { Platform, View } from "react-native";
import { SquircleView } from "react-native-figma-squircle";
import { HOME_HEADER_HEIGHT } from "../../../config/constants/dimensions";
import { responsiveScreenHeight } from "../../../config/constants/responsiveCalculations";
import { segmentClient } from "../../../config/segmentClient";
import { useAppTabsNavigation } from "../../../navigation/types";
import { Text, TextButton, theme } from "../../../ui";
import { Card } from "../../../ui/card";
import { YStack } from "../../../ui/stack";
import { images } from "../../../config/constants/images";

const SpecialCardBody = () => {
    const navigation = useAppTabsNavigation();

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
                    width: responsiveScreenHeight(20),
                    height: responsiveScreenHeight(20),
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
                    color={"content_1"}
                    style={{
                        textAlign: "center",
                    }}
                >
                    Friday: Your AI Navigator! 🤖
                </Text>
                <Text
                    variant="body_small"
                    color={"content_1"}
                    style={{
                        textAlign: "center",
                    }}
                    lineHeight={theme.spacing.$4}
                >
                    Your gateway to web3 & AI in one chat. Friday knows the ins
                    and outs of blockchain, DApps, and all things AI - making
                    tech simple and fun! Whether you're a crypto-curious newbie
                    or a seasoned techie, Friday's got your back. 🌐✨
                </Text>
            </YStack>
            <Card
                trackingName=""
                color={theme.colors.content_primary + "05"}
                blur={true}
                borderRadius={theme.spacing.$3}
            >
                <TextButton
                    trackingName="Chat with Friday Special Card Button Clicked"
                    label={"Chat Now"}
                    onPress={() => {
                        navigation.navigate("ChatStack");
                    }}
                    buttonColor={theme.colors.transparent}
                    labelColor={theme.colors.content_1}
                    small={true}
                />
            </Card>
        </YStack>
    );
};

export const TryChatSpecialCard = () => {
    const tabBarHeight = useBottomTabBarHeight();
    const postPadding = theme.spacing.$10;
    const cardHeight =
        theme.dimensions.fullHeight -
        HOME_HEADER_HEIGHT -
        tabBarHeight -
        postPadding +
        20;

    useEffect(() => {
        // analytics
        segmentClient.track("Try Chat Special Card Viewed");
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
