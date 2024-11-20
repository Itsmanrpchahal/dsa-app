import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export type InviteCode = {
    owner: string;
    code: string;
    expired: boolean;
    used_by: string | null;
} & Record<string, any>;

type InviteCodes = {
    inviteCodes: InviteCode[];
};

interface InviteCodesState {
    inviteCodes: InviteCodes;
    setInviteCodes: (inviteCodes: InviteCodes) => void;
    clearState: () => void;
}

export const useInviteCodesState = create<InviteCodesState>()(
    devtools(
        persist(
            (set) => ({
                inviteCodes: {
                    inviteCodes: [],
                },
                setInviteCodes: (inviteCodes: InviteCodes) => {
                    set({ inviteCodes });
                },
                clearState: () => {
                    set({ inviteCodes: { inviteCodes: [] } });
                },
            }),
            {
                name: "inviteCodes-storage",
                storage: createJSONStorage(() => AsyncStorage),
            }
        )
    )
);
