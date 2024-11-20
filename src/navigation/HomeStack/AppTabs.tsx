import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "expo-image";
import { theme } from "../../ui";
import { AppTabsParamList } from "../types";
import BrowserStack from "./tabstacks/BrowserStack";
import ChatStack from "./tabstacks/ChatStack";
import FeedStack from "./tabstacks/FeedStack";
import useDailyActivityViewHideState from "../../state/helpViewHideState";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { AppState, AppStateStatus, StyleSheet } from "react-native";
import { useDailyUsageState } from "../../state/dailyUsageState";
import { registerDailyUsageAction } from "../../helpers/points/api/registerDailyUsageAction";
import { log } from "../../config/logger";
import { BlurView } from "expo-blur";
import { Clickable } from "../../ui/clickable";
import { images } from "../../config/constants/images";

const Tab = createBottomTabNavigator<AppTabsParamList>();

export default function AppTabs() {
    const { dailyActivityViewHide, setDailyActivityViewHide } =
        useDailyActivityViewHideState();
    const isFocused = useIsFocused();

    // daily usage tracking which stops at 30 seconds of usage

    const [appState, setAppState] = useState<AppStateStatus>(
        AppState.currentState
    );
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isFocused) {
            setDailyActivityViewHideValue(true);
        } else {
            setDailyActivityViewHideValue(false);
        }
    }, [isFocused]);

    useEffect(() => {
        log.debug(
            dailyActivityViewHide.timerStartStop,
            "dailyActivityViewHide"
        );
        if (dailyActivityViewHide.timerStartStop) {
            handleAppActive();
            const subscription = AppState.addEventListener(
                "change",
                (nextAppState) => {
                    if (
                        appState.match(/inactive|background/) &&
                        nextAppState === "active"
                    ) {
                        console.log("App has come to the foreground!");
                        handleAppActive();
                    }
                    setAppState(nextAppState);
                }
            );

            return () => {
                subscription.remove();
            };
        }
    }, [dailyActivityViewHide, appState]);

    const setDailyActivityViewHideValue = async (value: boolean) => {
        await setDailyActivityViewHide(value);
    };

    const handleAppActive = async () => {
        const { usageInSeconds, lastUpdatedDay } =
            await useDailyUsageState.getState().dailyUsage;
        const currentDate = new Date();
        const currentDateString = currentDate.toISOString().substring(0, 10);
        if (lastUpdatedDay !== currentDateString) {
            // It's a new day, reset the counter

            console.log("daily usage log", "It's a new day, reset the counter");
            await useDailyUsageState.getState().setDailyUsage({
                usageInSeconds: 0,
                lastUpdatedDay: currentDateString,
            });

            startTimer();
        } else if (!usageInSeconds || usageInSeconds < 30) {
            // Continue the timer
            console.log(
                "daily usage log",
                "continue the timer from existing day"
            );
            startTimer(30 - (usageInSeconds || 0));
        } else {
            // Already used 30 seconds, don't do anything
            console.log(
                "daily usage log",
                "Already used 30 seconds, don't do anything"
            );
        }
    };

    const startTimer = (remainingSeconds: number = 30) => {
        if (timer) {
            clearTimeout(timer);
        }

        const currentDate = new Date();
        const currentDateString = currentDate.toISOString().substring(0, 10);

        const newTimer = setTimeout(async () => {
            registerDailyUsageAction();
            await useDailyUsageState.getState().setDailyUsage({
                usageInSeconds: 30,
                lastUpdatedDay: currentDateString,
            });
        }, remainingSeconds * 1000);

        setTimer(newTimer);
    };

    return (
        <Tab.Navigator
            initialRouteName={"FeedStack"}
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: {
                    position: "absolute",
                    backgroundColor: theme.colors.base_primary + "50",
                    borderTopWidth: 0,
                    shadowColor: theme.colors.transparent,
                },
                tabBarLabelStyle: {
                    ...theme.textVariants.body_small,
                    color: theme.colors.content_primary,
                },
                tabBarBackground: () => (
                    <BlurView
                        tint="dark"
                        intensity={50}
                        style={StyleSheet.absoluteFill}
                        blurReductionFactor={0.5}
                    />
                ),

                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === "ChatStack") {
                        iconName = focused
                            ? images.chatBoldIcon
                            : images.chatOutlineIcon;
                    } else if (route.name === "FeedStack") {
                        iconName = focused
                            ? images.feedBoldIcon
                            : images.feedOutlineIcon;
                    } else if (route.name === "BrowserStack") {
                        iconName = focused
                            ? images.browserBoldIcon
                            : images.browserOutlineIcon;
                    }

                    if (route.name === "FeedStack") {
                        return (
                            <Image
                                source={iconName}
                                style={{ width: 26.5, height: 25 }}
                            />
                        );
                    }

                    return (
                        <Image
                            source={iconName}
                            style={{ width: 25, height: 25 }}
                        />
                    );
                },
            })}
        >
            <Tab.Screen
                name="ChatStack"
                component={ChatStack}
                options={{
                    tabBarLabel: "Chat",
                }}
            />
            <Tab.Screen
                name="FeedStack"
                component={FeedStack}
                options={{
                    tabBarLabel: "Learn",
                }}
            />
            <Tab.Screen
                name="BrowserStack"
                component={BrowserStack}
                options={{
                    tabBarLabel: "Discover",
                }}
            />
        </Tab.Navigator>
    );
}
