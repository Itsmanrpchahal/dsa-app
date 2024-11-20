import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import { svgIcons } from "../../config/constants/iconSvgs";
import { handleGeneralInput } from "../../helpers/generalchat/api/handleGeneralInput";
import {
    TempChatInteraction,
    useTempChatState,
} from "../../state/tempChatState";
import { IconButton, theme } from "../../ui";
import { YStack, ZStack } from "../../ui/stack";
import ChatSuggestions from "./ChatSuggestions";

export const HumanInput = () => {
    const styles = StyleSheet.create({
        parent_view: {
            bottom: 0,
        },
        input_view: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: theme.spacing.$2,
            paddingHorizontal: theme.spacing.$2,
            paddingVertical: theme.spacing.$2,
            minHeight: 61,
            borderWidth: 1,
            borderColor: theme.colors.content_primary + 10,
            backgroundColor: theme.colors.base_primary + 50,
        },
        text_input: {
            textAlign: "left",
            width: "80%",
            color: theme.colors.char_orange,
            ...theme.textVariants.body_large,
        },
    });

    const [inputValue, setInputValue] = useState<string>("");
    const [waitingResponse, setWaitingResponse] = useState<boolean>(false);
    const [sendingError, setSendingError] = useState<boolean>(false);

    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        inputRef.current?.clear();
    }, []);

    const handleInputSubmit = () => {
        const newTempChatInteraction: TempChatInteraction = {
            query: inputValue,
            status: "pending",
        };

        useTempChatState
            .getState()
            .setTempChatHistory({ currentChat: newTempChatInteraction });

        handleGeneralInput(inputValue).catch((error) => {
            console.log("general chat input error", error);
            setWaitingResponse(false);
            setSendingError(true);
        });

        inputRef.current?.clear();
    };

    return (
        <YStack
            style={styles.parent_view}
            justifyContent={"center"}
            alignItems={"center"}
            width={"100%"}
            gap={theme.spacing.$2}
        >
            {inputValue.length === 0 &&
                !waitingResponse &&
                !sendingError &&
                !useTempChatState.getState().tempChatHistory?.currentChat && (
                    <ChatSuggestions />
                )}
            <BlurView
                intensity={2}
                style={styles.input_view}
                blurReductionFactor={0.5}
            >
                <TextInput
                    style={{
                        ...styles.text_input,
                        opacity: waitingResponse || sendingError ? 0.5 : 1,
                    }}
                    placeholder="talk to friday ..."
                    placeholderTextColor={theme.colors.content_1 + "50"}
                    value={inputValue}
                    onChangeText={setInputValue}
                    returnKeyType="send"
                    blurOnSubmit={false}
                    multiline={true}
                    onSubmitEditing={handleInputSubmit}
                    ref={inputRef}
                />
                <ZStack width={null} height={null}>
                    {inputValue.length > 0 && (
                        <IconButton
                            trackingName="Send Chat Input Button Clicked"
                            icon={svgIcons.arrowUp}
                            onPress={handleInputSubmit}
                            buttonColor={
                                waitingResponse
                                    ? theme.colors.color_1 + "50"
                                    : theme.colors.color_1
                            }
                            labelColor={
                                waitingResponse
                                    ? theme.colors.content_1 + "50"
                                    : theme.colors.content_1
                            }
                            disabled={waitingResponse}
                        />
                    )}
                </ZStack>
            </BlurView>
        </YStack>
    );
};
