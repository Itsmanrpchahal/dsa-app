import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useEffect, useState } from "react";
import { Keyboard, Platform, StyleSheet, View } from "react-native";
import {
    AvoidSoftInput,
    useSoftInputHeightChanged,
} from "react-native-avoid-softinput";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { HumanInput } from "../components";
import {
    BotMessage,
    RenderChatInteraction,
    RenderTemporaryChatInteraction,
} from "../components/chat/Messages";
import { ChatInteraction, useChatState } from "../state/chatState";
import { Text, theme } from "../ui";
import { TabStackScreen } from "../ui/screens";
import { log } from "../config/logger";

export default function ChatbotScreen() {
    const [keyboardOpened, setKeyboardOpened] = useState<boolean>(false);
    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardOpened(true);
        });
        Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardOpened(false);
        });
    }, []);
    const styles = StyleSheet.create({
        blur_view: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        },
        keyboard_avoiding_view: {
            flex: 1,
            width: theme.dimensions.fullWidth,
        },
        header_parent: {
            postion: "absolute",
            zIndex: 5,
            top: 0,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            elevation: 10,
            width: theme.dimensions.fullWidth,
            paddingHorizontal: theme.spacing.$4,
            paddingBottom: theme.spacing.$2,
            paddingTop: theme.spacing.statusbar + theme.spacing.$2,
        },
        body: {
            paddingHorizontal: theme.spacing.$4,
            paddingTop: theme.spacing.$4,
            paddingBottom: theme.spacing.$7,
            flexGrow: 1,
        },
    });

    function ChatHistory() {
        const chatState = useChatState();
        const renderChatInteraction = ({ item }: { item: ChatInteraction }) => (
            <RenderChatInteraction chatInteraction={item} />
        );

        return (
            <FlashList
                data={[...chatState.chatHistory.historyList].reverse()}
                renderItem={renderChatInteraction}
                estimatedItemSize={50}
                showsVerticalScrollIndicator={false}
                contentInsetAdjustmentBehavior="always"
                inverted={true}
                keyboardShouldPersistTaps="handled"
                ListFooterComponent={
                    <View
                        style={{
                            width: "100%",
                        }}
                    >
                        <BotMessage
                            message={
                                "Hi there. I'm Friday, your AI to the latest in tech, apps & beyond. I can talk about crypto, AI apps & more."
                            }
                        />
                    </View>
                }
                ListHeaderComponent={
                    <View
                        style={{
                            width: "100%",
                        }}
                    >
                        <RenderTemporaryChatInteraction />
                    </View>
                }
            />
        );
    }

    // keyboard and view handling

    const buttonContainerPaddingValue = useSharedValue(0);

    const buttonContainerAnimatedStyle = useAnimatedStyle(() => {
        return {
            paddingBottom: buttonContainerPaddingValue.value,
        };
    });

    const onFocusEffect = useCallback(() => {
        console.log("onFocusEffect called");
        AvoidSoftInput.setShouldMimicIOSBehavior(true);

        return () => {
            AvoidSoftInput.setShouldMimicIOSBehavior(false);
        };
    }, []);

    useFocusEffect(onFocusEffect);

    const tabBarHeight = useBottomTabBarHeight();
    useSoftInputHeightChanged(({ softInputHeight }) => {
        buttonContainerPaddingValue.value = withTiming(
            softInputHeight - tabBarHeight
        );
    });

    return (
        <TabStackScreen
            style={{
                ...styles.blur_view,
            }}
            trackingName="Chatbot Screen"
        >
            <View style={styles.header_parent}>
                <Text variant="heading_large" color="content_primary">
                    Friday
                </Text>
            </View>

            {/* <AnimatedLottieView
                source={require("../../assets/lottie/coming-soon.json")}
                autoPlay
                loop
                style={{
                    width: 200,
                    height: 200,
                }}
            /> */}

            <View
                style={{
                    alignSelf: "stretch",
                    flexGrow: 1,
                    paddingHorizontal: theme.spacing.$4,
                }}
            >
                <ChatHistory />
            </View>

            <Animated.View
                style={[
                    buttonContainerAnimatedStyle,
                    {
                        alignSelf: "stretch",
                    },
                ]}
            >
                <View
                    style={{
                        alignSelf: "stretch",
                        paddingHorizontal: theme.spacing.$4,
                        paddingTop: theme.spacing.$2,
                        paddingBottom:
                            Platform.OS === "android"
                                ? keyboardOpened
                                    ? theme.spacing.$10
                                    : theme.spacing.$7
                                : theme.spacing.$2,
                    }}
                >
                    <HumanInput />
                </View>
            </Animated.View>
        </TabStackScreen>
    );
}
