import React from "react";
import { ScrollView } from "react-native";
import { handleGeneralInput } from "../../helpers/generalchat";
import {
    TempChatInteraction,
    useTempChatState,
} from "../../state/tempChatState";
import { Text, theme } from "../../ui";
import { Card } from "../../ui/card";
import { XStack, YStack } from "../../ui/stack";
import { segmentClient } from "../../config/segmentClient";

const suggestions: { title: string; continuation: string }[] = [
    {
        title: "Get started with web3",
        continuation: "world as a beginner",
    },
    {
        title: "Help me bridge assets",
        continuation: "from ETH to Polygon",
    },
    {
        title: "Suggest me wallets",
        continuation: "and how to choose one",
    },
    {
        title: "Where can I buy",
        continuation: "my first NFT",
    },
];

function QuestionSuggestion(props: { title: string; continuation: string }) {
    const handleAskQuestion = async () => {
        const newTempChatInteraction: TempChatInteraction = {
            query: props.title + " " + props.continuation,
            status: "pending",
        };

        useTempChatState
            .getState()
            .setTempChatHistory({ currentChat: newTempChatInteraction });

        segmentClient.track("Chat Suggestion Clicked", {
            suggestion: props.title + " " + props.continuation,
        });

        handleGeneralInput(props.title + " " + props.continuation).catch(
            (error) => {
                console.log("general chat input error", error);
            }
        );
    };

    return (
        <Card
            onPress={() => handleAskQuestion()}
            color={theme.colors.base_1 + "75"}
            cardParentStyle={{
                width: theme.dimensions.fullWidth * 0.6,
                marginRight: theme.spacing.$2,
                padding: theme.spacing.$2,
            }}
            trackingName="Chat Suggestion Clicked"
            trackingPrarameters={{
                suggestion: props.title + " " + props.continuation,
            }}
        >
            <YStack
                justifyContent={"center"}
                alignItems={"flex-start"}
                width={null}
            >
                <Text
                    variant="body_post_content_bold"
                    color="content_1"
                    numberOfLines={1}
                >
                    {props.title}
                </Text>
                <Text
                    variant="body_small"
                    color="content_1"
                    numberOfLines={1}
                    style={{ opacity: 0.75 }}
                >
                    {props.continuation}
                </Text>
            </YStack>
        </Card>
    );
}

function ChatSuggestions() {
    return (
        <XStack justifyContent={"center"} alignItems={"center"} width={null}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {suggestions.map((suggestion, index) => (
                    <QuestionSuggestion
                        key={index}
                        title={suggestion.title}
                        continuation={suggestion.continuation}
                    />
                ))}
            </ScrollView>
        </XStack>
    );
}

export default React.memo(ChatSuggestions);
