import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { BrowserUrlType } from "../types";

interface CurrentTabState {
    currentTab: BrowserUrlType | null;
    setCurrentTab: (currentTab: BrowserUrlType) => void;
    clearState: () => void;
}

export const useCurrentTabState = create<CurrentTabState>()(
    devtools(
        persist(
            (set) => ({
                currentTab: null,
                setCurrentTab: (currentTab: BrowserUrlType) =>
                    set({ currentTab }),
                clearState: () =>
                    set({
                        currentTab: null,
                    }),
            }),
            {
                name: "currentTab-storage",
                storage: createJSONStorage(() => AsyncStorage),
            }
        )
    )
);
