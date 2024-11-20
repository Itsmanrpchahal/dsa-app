import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ChatInteraction = {
    id: number;
    query: string;
    answer: string;
    chat_time?: string;
    dapp_ids: any[];
    rating?: number;
    rated?: boolean | null;
} & Record<string, any>;

export interface ChatHistory {
    historyList: ChatInteraction[];
}

export interface ChatState {
    chatHistory: ChatHistory;
    setChatHistory: (newChatItems: any[]) => void;
    addRating: (chatId: number, rating: number) => void;
    clearState: () => void;
}

export const useChatState = create<ChatState>()(
    devtools(
        persist(
            (set) => ({
                chatHistory: {
                    historyList: [],
                },
                setChatHistory: (newChatItems: any[]) =>
                    set((state) => ({
                        chatHistory: {
                            historyList: [
                                ...state.chatHistory.historyList,
                                ...newChatItems,
                            ],
                        },
                    })),
                addRating: (chatId: number, rating: number) =>
                    set((state) => ({
                        chatHistory: {
                            historyList: state.chatHistory.historyList.map(
                                (item) => {
                                    if (item.id === chatId) {
                                        item.rating = rating;
                                        item.rated = true;
                                    }
                                    return item;
                                }
                            ),
                        },
                    })),
                clearState: () =>
                    set({
                        chatHistory: { historyList: [] },
                    }),
            }),
            {
                name: "chat-state",
                storage: createJSONStorage(() => AsyncStorage),
            }
        )
    )
);
