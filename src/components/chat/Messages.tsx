import { ActivityIndicator, View } from "react-native";
import { IconButton, Text, theme } from "../../ui";
import { useHomeStackNavigation } from "../../navigation/types";
import { ChatInteraction, useChatState } from "../../state/chatState";
import {
    TempChatInteraction,
    useTempChatState,
} from "../../state/tempChatState";
import { useEffect, useState } from "react";
import { handleGeneralInput } from "../../helpers/generalchat";
import { SquircleView } from "react-native-figma-squircle";
import { XStack, YStack } from "../../ui/stack";
import { sendChatFeedback } from "../../helpers/generalchat/api/sendChatFeedback";
import * as Burnt from "burnt";
import { svgIcons } from "../../config/constants/iconSvgs";
import { Clickable } from "../../ui/clickable";

interface RenderChatInteractionProps {
    chatInteraction: ChatInteraction;
}

export function RenderChatInteraction({
    chatInteraction,
}: RenderChatInteractionProps) {
    const { id, query, answer, dapp_ids, rating, rated } = chatInteraction;

    return (
        <View style={{ width: "100%" }}>
            <HumanMessage message={query} />
            <BotMessage
                id={id}
                message={answer}
                apps={dapp_ids}
                currentRating={rating}
                ratedOrNot={rated}
            />
        </View>
    );
}

// for when the message is streaming and not added to history
export function RenderTemporaryChatInteraction() {
    const tempChatState = useTempChatState();

    if (
        !tempChatState.tempChatHistory.currentChat ||
        tempChatState.tempChatHistory.currentChat.query === ""
    ) {
        return <></>;
    }

    if (tempChatState.tempChatHistory.currentChat.status === "pending") {
        return (
            <View style={{ width: "100%" }}>
                <HumanMessage
                    message={tempChatState.tempChatHistory.currentChat?.query}
                />
                <WaitingForBotMessage />
            </View>
        );
    }

    if (tempChatState.tempChatHistory.currentChat.status === "failed") {
        return (
            <View style={{ width: "100%" }}>
                <HumanMessage
                    message={tempChatState.tempChatHistory.currentChat?.query}
                    failed={true}
                />
            </View>
        );
    }

    return (
        <View style={{ width: "100%", marginVertical: theme.spacing.$2 }}>
            <HumanMessage
                message={tempChatState.tempChatHistory.currentChat?.query}
            />
            <BotMessage
                message={
                    tempChatState.tempChatHistory.currentChat?.answer ?? ""
                }
            />
        </View>
    );
}

// individual message components

const waitingMessages = [
    "firing neurons ...",
    "thinking ...",
    "mixing chemicals…",
    "consulting the oracle...",
    "brewing answers...",
    "connecting the dots...",
    "calculating probabilities...",
    "consulting the cosmos...",
    "deciphering the codes...",
    "composing thoughts...",
];

export function WaitingForBotMessage() {
    const [currentMessage, setCurrentMessage] = useState(waitingMessages[0]);
    const messageChangeInterval = 1000; // Change message every 1 second

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessage(() => {
                const randomIndex = Math.floor(
                    Math.random() * waitingMessages.length
                );
                return waitingMessages[randomIndex];
            });
        }, messageChangeInterval);

        return () => clearInterval(interval);
    }, []);

    return (
        <View
            style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginVertical: theme.spacing.$4,
                alignSelf: "flex-start",
            }}
        >
            <ActivityIndicator size="small" color={theme.colors.color_1} />
            <Text
                variant="chat_message"
                color="color_1"
                style={{
                    textAlign: "left",
                    maxWidth: "100%",
                    marginHorizontal: theme.spacing.$2,
                    opacity: 0.5,
                }}
            >
                {currentMessage}
            </Text>
        </View>
    );
}

interface BotMessageProps {
    message: string;
    id?: number;
    currentRating?: number;
    apps?: any[];
    ratedOrNot?: boolean | null;
}

export function BotMessage({
    message,
    id,
    currentRating,
    apps,
    ratedOrNot,
}: BotMessageProps) {
    const navigation = useHomeStackNavigation();

    if (!apps) {
        return (
            <Text
                variant="chat_message"
                color="light"
                style={{
                    textAlign: "left",
                    maxWidth: "100%",
                    marginVertical: theme.spacing.$2,
                }}
            >
                {message}
            </Text>
        );
    }

    const renderText = () => {
        const textElements = [];
        let remainingMessage = message;

        while (remainingMessage.length) {
            let foundMatch = false;

            // Check for each app name if it is in the remaining message
            for (const app of apps) {
                if (remainingMessage.startsWith(app.name)) {
                    // Add hyperlink text
                    textElements.push(
                        <Clickable
                            trackingName="App Hyperlinked In Chat Message Clicked"
                            trackingParameters={{ appId: app.id }}
                            key={textElements.length}
                            onPress={() =>
                                navigation.navigate("AppScreen", {
                                    appId: app.id,
                                    source: "ChatMessage",
                                })
                            }
                        >
                            <Text
                                variant="chat_message"
                                color="light"
                                style={{
                                    textAlign: "left",
                                    maxWidth: "100%",
                                    textDecorationLine: "underline",
                                    color: theme.colors.color_1,
                                }}
                            >
                                {app.name}
                            </Text>
                        </Clickable>
                    );

                    // Update the remaining message
                    remainingMessage = remainingMessage.substring(
                        app.name.length
                    );
                    foundMatch = true;
                    break;
                }
            }

            if (!foundMatch) {
                // Add the first word as normal text and update the remaining message
                const firstSpaceIndex = remainingMessage.indexOf(" ");
                const firstWord =
                    firstSpaceIndex !== -1
                        ? remainingMessage.slice(0, firstSpaceIndex)
                        : remainingMessage;

                textElements.push(
                    <Text
                        key={textElements.length}
                        variant="chat_message"
                        color="light"
                        style={{
                            textAlign: "left",
                            maxWidth: "100%",
                        }}
                    >
                        {firstWord + " "}
                    </Text>
                );

                remainingMessage =
                    firstSpaceIndex !== -1
                        ? remainingMessage.substring(firstSpaceIndex + 1)
                        : "";
            }
        }

        return textElements;
    };

    const RatingButton = (props: { like: boolean }) => {
        if (!id) {
            return null;
        }

        const handleRating = async () => {
            sendChatFeedback(id, props.like ? 1 : 0).then((response) => {
                useChatState.getState().addRating(id, props.like ? 1 : 0);
            });
        };

        return (
            <IconButton
                trackingName="Chat Rating Button Clicked"
                trackingParameters={{
                    chatId: id,
                    like: props.like ? "true" : "false",
                }}
                icon={props.like ? svgIcons.thumbsUp : svgIcons.thumbsDown}
                buttonColor={theme.colors.base_primary + "50"}
                labelColor={
                    currentRating === 1 && props.like
                        ? theme.colors.color_1
                        : currentRating === 0 && !props.like
                        ? theme.colors.negative
                        : theme.colors.content_1
                }
                style={{
                    marginHorizontal: theme.spacing.$1,
                }}
                onPress={() => {
                    if (ratedOrNot) {
                        Burnt.toast({
                            title: "already rated",
                            preset: "error",
                        });
                    } else {
                        handleRating();
                    }
                }}
            />
        );
    };

    return (
        <YStack
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            width={"100%"}
            gap={theme.spacing.$2}
            style={{ marginVertical: theme.spacing.$2 }}
        >
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {renderText()}
            </View>
            <XStack
                justifyContent={"center"}
                alignItems={"center"}
                width={null}
                gap={theme.spacing.$1}
            >
                <RatingButton like={true} />
                <RatingButton like={false} />
            </XStack>
        </YStack>
    );
}

interface HumanMessageProps {
    message: string;
    failed?: boolean;
}

const handleResend = async (input: string) => {
    const newTempChatInteraction: TempChatInteraction = {
        query: input,
        status: "pending",
    };

    useTempChatState
        .getState()
        .setTempChatHistory({ currentChat: newTempChatInteraction });

    handleGeneralInput(input).catch((error) => {
        console.log("general chat input error", error);
    });
};

export function HumanMessage({ message, failed = false }: HumanMessageProps) {
    return (
        <View style={{ width: "100%", marginVertical: theme.spacing.$2 }}>
            <SquircleView
                squircleParams={{
                    cornerSmoothing: 1,
                    cornerRadius: 15,
                    fillColor: theme.colors.base_primary + "50",
                }}
                style={{
                    alignSelf: "flex-end",
                    padding: theme.spacing.$2,
                    maxWidth: "90%",
                }}
            >
                <Text
                    variant="body_post_content_bold"
                    color="accent_orange"
                    style={{
                        textAlign: "right",
                    }}
                >
                    {message}
                </Text>
            </SquircleView>
            {failed && (
                <Clickable
                    onPress={() => handleResend(message)}
                    trackingName=""
                >
                    <Text
                        variant="caption"
                        color="negative"
                        style={{
                            textAlign: "right",
                            width: "100%",
                            marginVertical: theme.spacing.$1,
                        }}
                    >
                        Resend
                    </Text>
                </Clickable>
            )}
        </View>
    );
}
