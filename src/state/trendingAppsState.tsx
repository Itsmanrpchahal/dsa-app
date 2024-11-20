import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import _ from "lodash";

export type TrendingAppType = {
    appId: string;
    hot: boolean;
} & Record<string, any>;

interface TrendingAppsStateType {
    trendingApps: TrendingAppType[] | null;
    setTrendingApps: (trendingApps: TrendingAppType[]) => void;
    addNewTrendingApp: (trendingApp: TrendingAppType) => void;
    clearState: () => void;
}

export const useTrendingAppsState = create<TrendingAppsStateType>()(
    devtools(
        persist(
            (set) => ({
                trendingApps: null,
                setTrendingApps: (trendingApps: TrendingAppType[]) =>
                    set({ trendingApps }),
                addNewTrendingApp: (trendingApp: TrendingAppType) =>
                    set((state) => {
                        return {
                            trendingApps: _.unionBy(
                                [trendingApp],
                                state.trendingApps || [],
                                "appId"
                            ),
                        };
                    }),
                clearState: () =>
                    set({
                        trendingApps: null,
                    }),
            }),
            {
                name: "trendingApps-storage",
                storage: createJSONStorage(() => AsyncStorage),
            }
        )
    )
);
