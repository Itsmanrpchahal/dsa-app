import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { PostType } from "../types";

export type Feed = {
    lastFetched: string | null;
    feed_posts: PostType[];
};

interface FeedState {
    feed: Feed;
    setFeed: (feed: Feed) => void;
    clearState: () => void;
    unSeenPosts?: string[];
    addUnseenPost?: (id: string) => void;
    removeUnseenPost?: (id: string) => void;
}

export const useFeedState = create<FeedState>()(
    devtools(
        persist(
            (set) => ({
                feed: {
                    lastFetched: null,
                    feed_posts: [],
                },
                setFeed: (feed: Feed) => set({ feed: feed }),
                clearState: () =>
                    set({
                        feed: {
                            lastFetched: null,
                            feed_posts: [],
                        },
                        unSeenPosts: [],
                    }),
                unSeenPosts: [],
                addUnseenPost: (id: string) =>
                    set((state) => {
                        if (state.unSeenPosts?.includes(id)) {
                            return state;
                        }
                        return {
                            unSeenPosts: [...(state.unSeenPosts ?? []), id],
                        };
                    }),
                removeUnseenPost: (id: string) => {
                    set((state) => ({
                        unSeenPosts: state.unSeenPosts?.filter(
                            (postId) => postId !== id
                        ),
                    }));
                },
            }),
            {
                name: "feed-state",
                storage: createJSONStorage(() => AsyncStorage),
            }
        )
    )
);
