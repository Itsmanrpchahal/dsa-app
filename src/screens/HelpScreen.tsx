import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { useHomeStackNavigation } from "../navigation/types";
import { useHelpShowState } from "../state/helpShowState";
import useDailyActivityViewHideState from "../state/helpViewHideState";
import { Text, theme } from "../ui";
import { Clickable } from "../ui/clickable";
import { ModalScreen } from "../ui/screens";
import { XStack, YStack } from "../ui/stack";
import { PUBLIC_APP_NAME } from "@env";
import { images } from "../config/constants/images";

const helpImages = [
    {
        id: "1",
        source: require("../../assets/helpimages/help-prod-t-1-f/help-prod-t-1-f.png"),
        title: "Your Discovery Compass",
        message: `🧭 Seamlessly navigate the vast Web3 ocean. Find and use dApps and AI tools directly in ${PUBLIC_APP_NAME}`,
    },
    {
        id: "2",
        source: require("../../assets/helpimages/help-prod-t-2-f/help-prod-t-2-f.png"),
        title: `Earn Points with App2Earn on ${PUBLIC_APP_NAME}`,
        message: `🌟 Earn points by using ${PUBLIC_APP_NAME} daily and inviting friends, leading to more exclusive perks`,
    },
    {
        id: "4",
        source: require("../../assets/helpimages/help-prod-t-4-f/help-prod-t-4-f.png"),
        title: "Daily Alpha Awaits",
        message:
            "🎯 Stay ahead with bite-sized news on the latest in Web3 & AI. Never miss an alpha or emerging trend 📈",
    },
];

export default function HelpScreen() {
    const { dailyActivityViewHide, setDailyActivityViewHide } =
        useDailyActivityViewHideState();
    const styles = StyleSheet.create({
        blur_view: {
            flex: 1,
            alignItems: "center",
        },
        textStyle: {
            width: theme.dimensions.fullWidth * 0.9,
        },
        textMessageStyle: {
            width: theme.dimensions.fullWidth * 0.9,
            marginTop: theme.spacing.$4,
        },
        dashLines: {
            height: theme.spacing.$1,
            width: theme.spacing.$4,
            borderRadius: theme.spacing.$1,
            marginHorizontal: theme.spacing.$1,
        },
        nextButton: {
            backgroundColor: theme.colors.color_green,
            borderRadius: 9,
            padding: theme.spacing.$3,
        },
        nextButtonIcon: {
            height: theme.spacing.$3,
            width: theme.spacing.$4,
        },
    });

    const navigation = useHomeStackNavigation();

    useEffect(() => {
        setDailyActivityViewHide(false);
    }, []);

    const [currentPage, setCurrentPage] = useState(0);
    const scrollViewRef = useRef<ScrollView>(null);

    const scrollToNextPage = () => {
        if (currentPage < helpImages.length - 1) {
            const nextPage = currentPage + 1;
            scrollViewRef.current?.scrollTo({
                x: theme.dimensions.fullWidth * nextPage,
                animated: true,
            });
        } else {
            useHelpShowState.getState().toggleAppHelpShown();
            navigation.navigate("AppTabs");
        }
    };

    const handleScroll = (event: any) => {
        const page = Math.round(
            event.nativeEvent.contentOffset.x / theme.dimensions.fullWidth
        );
        setCurrentPage(page);
    };

    return (
        <ModalScreen trackingName={"Help Screen"}>
            <YStack
                width={"100%"}
                justifyContent="center"
                alignItems="center"
                style={{
                    height:
                        Platform.OS === "ios"
                            ? theme.dimensions.fullHeight * 0.85
                            : theme.dimensions.fullHeight * 0.9,
                }}
            >
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    ref={scrollViewRef}
                >
                    {helpImages.map((image, index) => (
                        <YStack
                            alignItems="center"
                            justifyContent="space-evenly"
                            width={theme.dimensions.fullWidth}
                        >
                            <Image
                                key={image.id}
                                source={image.source}
                                style={{
                                    width: theme.dimensions.fullWidth * 0.7,
                                    height: theme.dimensions.fullHeight * 0.3,
                                }}
                                contentFit="contain"
                            />
                            <YStack
                                alignItems="center"
                                justifyContent="center"
                                width={theme.dimensions.fullWidth}
                            >
                                <Text
                                    variant="heading_large"
                                    color={"content_1"}
                                    style={styles.textStyle}
                                >
                                    {image.title}
                                </Text>

                                <Text
                                    variant={"heading_small"}
                                    color={"content_1"}
                                    style={styles.textMessageStyle}
                                >
                                    {image.message}
                                </Text>
                            </YStack>
                        </YStack>
                    ))}
                </ScrollView>

                <XStack
                    width={theme.dimensions.fullWidth * 0.9}
                    justifyContent="space-between"
                    alignItems="center"
                    style={{ paddingBottom: theme.spacing.$7 }}
                >
                    <Clickable
                        trackingName="Help Screen Next Button Clicked"
                        trackingParameters={{
                            currentPage: String(currentPage),
                            isLastPage: currentPage === 2 ? "true" : "false",
                        }}
                        onPress={() => {
                            scrollToNextPage();
                        }}
                    >
                        <XStack
                            justifyContent="space-evenly"
                            alignItems="center"
                            width={
                                currentPage === 2
                                    ? theme.dimensions.fullWidth * 0.5
                                    : theme.dimensions.fullWidth * 0.3
                            }
                            style={styles.nextButton}
                        >
                            <Text variant={"heading_small"} color={"dark"}>
                                {currentPage === 2
                                    ? `Start ${PUBLIC_APP_NAME}`
                                    : "Next"}
                            </Text>
                            {currentPage != 2 && (
                                <Image
                                    style={styles.nextButtonIcon}
                                    resizeMode="contain"
                                    tintColor={theme.colors.dark}
                                    source={images.helpNextIcon}
                                />
                            )}
                        </XStack>
                    </Clickable>

                    <View
                        style={{
                            flexDirection: "row",
                            marginRight: theme.spacing.$4,
                        }}
                    >
                        {helpImages.map((image, index) => (
                            <View
                                style={[
                                    styles.dashLines,
                                    {
                                        backgroundColor:
                                            currentPage === index
                                                ? theme.colors.color_green
                                                : theme.colors.off_dark,
                                    },
                                ]}
                            ></View>
                        ))}
                    </View>
                </XStack>
            </YStack>
        </ModalScreen>
    );
}
