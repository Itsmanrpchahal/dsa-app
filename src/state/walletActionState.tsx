import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export type WalletAction = {
    walletData: any;
};

interface WalletActionState {
    walletAction: WalletAction;
    setWalletAction: (walletAction: any) => void;
    clearState: () => void;
}

export const useWalletActionState = create<WalletActionState>()(
    devtools(
        persist(
            (set) => ({
                walletAction: { walletData: {} },
                setWalletAction: (walletData: boolean) => {
                    set((state) => ({
                        walletAction: {
                            ...state.walletAction,
                            walletData: walletData,
                        },
                    }));
                },
                clearState: () => set({ walletAction: { walletData: {} } }),
            }),
            {
                name: "walletAction-state",
                storage: createJSONStorage(() => AsyncStorage),
            }
        )
    )
);

