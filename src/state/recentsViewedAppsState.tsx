import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import _ from "lodash";
export type RecentlyViewedAppDetails = {
    appId: string;
    name: string;
    appUrl: string;
    images: object;
} & Record<string, any>;

interface RecentlyViewedAppsState {
    recentlyViewedApps: RecentlyViewedAppDetails[] | null;
    setRecentlyViewedApps: (
        recentlyViewedApps: RecentlyViewedAppDetails[]
    ) => void;
    addNewAppToRecentlyViewedApps: (
        recentlyViewedApp: RecentlyViewedAppDetails
    ) => void;
    clearState: () => void;
}

export const useRecentlyViewedAppsState = create<RecentlyViewedAppsState>()(
    devtools(
        persist(
            (set) => ({
                recentlyViewedApps: null,
                setRecentlyViewedApps: (
                    recentlyViewedApps: RecentlyViewedAppDetails[]
                ) => set({ recentlyViewedApps }),
                addNewAppToRecentlyViewedApps: (
                    recentlyViewedApp: RecentlyViewedAppDetails
                ) =>
                    set((state) => {
                        if (
                            recentlyViewedApp.images &&
                            Object.keys(recentlyViewedApp.images).length > 0 &&
                            recentlyViewedApp.name &&
                            recentlyViewedApp.name.trim() !== ""
                        ) {
                            return {
                                recentlyViewedApps: _.unionBy(
                                    [recentlyViewedApp],
                                    state.recentlyViewedApps || [],
                                    "appId"
                                ),
                            };
                        } else {
                            return state;
                        }
                    }),
                clearState: () =>
                    set({
                        recentlyViewedApps: null,
                    }),
            }),
            {
                name: "recentlyViewedApps-storage",
                storage: createJSONStorage(() => AsyncStorage),
            }
        )
    )
);
