import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export type Action = {
    action_id: string;
    name: string;
    description: string;
    points_award: number;
    IsOneTime: boolean;
    status: string;
    user_table_column_name: string | null;
} & Record<string, any>;

export type ActionsForPoints = {
    actionsList: Action[] | null;
};

interface ActionsForPointsState {
    actionsForPoints: ActionsForPoints;
    setActionsForPoints: (actionsForPoints: ActionsForPoints) => void;
    clearState: () => void;
}

export const useActionsForPointsState = create<ActionsForPointsState>()(
    devtools(
        persist(
            (set) => ({
                actionsForPoints: {
                    actionsList: null,
                },
                setActionsForPoints: (actionsForPoints: ActionsForPoints) =>
                    set({ actionsForPoints }),
                clearState: () =>
                    set({ actionsForPoints: { actionsList: null } }),
            }),
            {
                name: "actionsForPoints-storage",
                storage: createJSONStorage(() => AsyncStorage),
            }
        )
    )
);
