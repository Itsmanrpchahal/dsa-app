import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export type DailyActivityViewHide = {
    timerStartStop: boolean;
    setTimerStartStop: boolean;
};

interface DailyActivityViewHideState {
    dailyActivityViewHide: DailyActivityViewHide;
    setDailyActivityViewHide: (dailyActivityViewHide: boolean) => void;
}

export const useDailyActivityViewHideState =
    create<DailyActivityViewHideState>()(
        devtools(
            persist(
                (set) => ({
                    dailyActivityViewHide: {
                        timerStartStop: false,
                        setTimerStartStop: false,
                    },
                    setDailyActivityViewHide: (newTimerStartStop: boolean) => {
                        set((state) => ({
                            dailyActivityViewHide: {
                                ...state.dailyActivityViewHide,
                                timerStartStop: newTimerStartStop,
                            },
                        }));
                    },
                }),
                {
                    name: "dailyActivityViewHide-state",
                    storage: createJSONStorage(() => AsyncStorage),
                }
            )
        )
    );

export default useDailyActivityViewHideState;
