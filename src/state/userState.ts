import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export type UserDetails = {
    uuid: string | null;
    name: string | null;
    live_days: Date[] | null;
    streak_count: number | null;
    expert_level: number | null;
    interests: string[] | null;
    app_level: number | null;
} & Record<string, any>;

interface UserState {
    userDetails: UserDetails;
    setUserDetails: (userDetails: UserDetails) => void;
    clearState: () => void;
}

export const useUserState = create<UserState>()(
    devtools(
        persist(
            (set) => ({
                userDetails: {
                    uuid: null,
                    name: null,
                    live_days: null,
                    streak_count: null,
                    expert_level: null,
                    interests: null,
                    app_level: null,
                },
                setUserDetails: (userDetails: UserDetails) =>
                    set({ userDetails: userDetails }),
                clearState: () =>
                    set({
                        userDetails: {
                            uuid: null,
                            name: null,
                            live_days: null,
                            streak_count: null,
                            expert_level: null,
                            interests: null,
                            app_level: null,
                        },
                    }),
            }),
            {
                name: "user-state",
                storage: createJSONStorage(() => AsyncStorage),
            }
        )
    )
);
