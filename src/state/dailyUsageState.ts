import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export type DailyUsage = {
    usageInSeconds: number | null;
    lastUpdatedDay: string | null;
};

interface DailyUsageState {
    dailyUsage: DailyUsage;
    setDailyUsage: (dailyUsage: DailyUsage) => void;
    clearState: () => void;
}

export const useDailyUsageState = create<DailyUsageState>()(
    devtools(
        persist(
            (set) => ({
                dailyUsage: {
                    usageInSeconds: null,
                    lastUpdatedDay: null,
                },
                setDailyUsage: (dailyUsage: DailyUsage) =>
                    set({ dailyUsage: dailyUsage }),
                clearState: () =>
                    set({
                        dailyUsage: {
                            usageInSeconds: null,
                            lastUpdatedDay: null,
                        },
                    }),
            }),
            {
                name: "daily-usage-state",
                storage: createJSONStorage(() => AsyncStorage),
            }
        )
    )
);
