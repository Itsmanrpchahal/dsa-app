import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type HelpShown = {
    dailyPointsHelpShown: boolean;
    eli5HelpShown: boolean;
    appHelpShown?: boolean;
} & Record<string, any>;

interface HelpShowState {
    helpShown: HelpShown;
    setHelpShown: (newHelpShown: HelpShown) => void;
    toggleHelpShownKey: (key: keyof HelpShown) => void;
    toggleAppHelpShown: () => void;
    clearState: () => void;
}

export const useHelpShowState = create<HelpShowState>()(
    devtools(
        persist(
            (set) => ({
                helpShown: {
                    dailyPointsHelpShown: false,
                    eli5HelpShown: false,
                    appHelpShown: false,
                },
                setHelpShown: (newHelpShown: HelpShown) =>
                    set((state) => ({
                        helpShown: newHelpShown,
                    })),
                toggleHelpShownKey: (key: keyof HelpShown) =>
                    set((state) => ({
                        helpShown: {
                            ...state.helpShown,
                            [key]: !state.helpShown[key],
                        },
                    })),
                toggleAppHelpShown: () =>
                    set((state) => ({
                        helpShown: {
                            ...state.helpShown,
                            appHelpShown: true,
                        },
                    })),
                clearState: () =>
                    set((state) => ({
                        helpShown: {
                            dailyPointsHelpShown: false,
                            eli5HelpShown: false,
                            appHelpShown: false,
                        },
                    })),
            }),
            {
                name: "help-shown-storage",
                storage: createJSONStorage(() => AsyncStorage),
            }
        )
    )
);
