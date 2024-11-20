import { CHAT_API_KEY } from "@env";
import "react-native-url-polyfill/auto";
import { useTempChatState } from "../../../state/tempChatState";
import { useUserState } from "../../../state/userState";

import EventSource, { EventSourceListener } from "../../sse";
import { useChatState } from "../../../state/chatState";
import { segmentClient } from "../../../config/segmentClient";
import axios from "axios";
import { log } from "../../../config/logger";

// @ts-ignore

export async function handleGeneralInput(
    inputMessage: string
): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        const uuid = useUserState.getState().userDetails.uuid;

        if (!inputMessage) {
            reject(new Error("Input message is empty"));
            return;
        }

        if (!uuid) {
            reject(new Error("UUID is not available"));
            return;
        }

        const chatFridayCall = `https://friday-api.dappstore.app/chat/?query=${inputMessage}&user=${uuid}&stream=false`;

        axios({
            method: "GET",
            url: chatFridayCall,
            headers: {
                "X-FRIDAY-KEY": CHAT_API_KEY,
                "Content-Type": "application/json; charset=utf-8",
            },
        })
            .then((response) => {
                log.debug("response from simple friday call", response.data);
                if (response.status === 200) {
                    // analytics
                    segmentClient.track(
                        "Message Sent and AI Response Received"
                    );

                    useTempChatState.getState().clearState();
                    useChatState.getState().setChatHistory([
                        {
                            id: response.data.chat_id,
                            query: inputMessage,
                            answer: response.data.answer,
                            dapp_ids: response.data.dapps,
                        },
                        ...useChatState.getState().chatHistory.historyList,
                    ]);

                    return true;
                } else {
                    throw new Error("Failed to handle general input");
                }
            })
            .catch((error) => {
                // Handle the error here
                useTempChatState.getState().updateStatus("failed");

                // analytics
                segmentClient.track("Message Sent and AI Response Failed");
                log.error("error from simple friday call", error);
                throw new Error("Failed to handle general input");
            });
    });
}
