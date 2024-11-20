import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type TempChatInteraction = {
    query: string;
    answer?: string;
    status: "pending" | "streaming" | "failed" | "success";
};

export interface TempChatHistory {
    currentChat: TempChatInteraction | null;
}

export interface TempChatState {
    tempChatHistory: TempChatHistory;
    setTempChatHistory: (newTempChat: TempChatHistory) => void;
    updateAnswerMessage: (answer: string) => void;
    updateStatus: (
        status: "pending" | "streaming" | "failed" | "success"
    ) => void;
    clearState: () => void;
}

export const useTempChatState = create<TempChatState>()(
    devtools(
        persist(
            (set) => ({
                tempChatHistory: {
                    currentChat: null,
                },
                setTempChatHistory: (newTempChat: TempChatHistory) =>
                    set((state) => ({
                        tempChatHistory: newTempChat,
                    })),
                updateAnswerMessage: (answer: string) =>
                    set((state) => ({
                        tempChatHistory: {
                            currentChat: {
                                ...state.tempChatHistory.currentChat,
                                answer: state.tempChatHistory.currentChat
                                    ?.answer
                                    ? state.tempChatHistory.currentChat.answer +
                                      answer
                                    : answer,
                            },
                        },
                    })),
                updateStatus: (
                    status: "pending" | "streaming" | "failed" | "success"
                ) =>
                    set((state) => ({
                        tempChatHistory: {
                            currentChat: {
                                ...state.tempChatHistory.currentChat,
                                status,
                            },
                        },
                    })),
                clearState: () =>
                    set({
                        tempChatHistory: {
                            currentChat: null,
                        },
                    }),
            }),
            {
                name: "temp-chat-state",
                storage: createJSONStorage(() => AsyncStorage),
            }
        )
    )
);
