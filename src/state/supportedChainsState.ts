import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export type Chain = {
    name: string;
    chainId: number;
    chainIdHex: string;
    slug: string;
    nativeToken: any;
} & Record<string, any>;

export type SupportedChains = {
    chains: Chain[] | null;
};

interface SupportedChainsState {
    supportedChains: SupportedChains;
    setSupportedChains: (supportedChains: SupportedChains) => void;
    clearState: () => void;
}

export const useSupportedChainsState = create<SupportedChainsState>()(
    devtools(
        persist(
            (set) => ({
                supportedChains: {
                    chains: null,
                },
                setSupportedChains: (supportedChains: SupportedChains) =>
                    set({ supportedChains }),
                clearState: () => set({ supportedChains: { chains: null } }),
            }),
            {
                name: "supportedChains-storage",
                storage: createJSONStorage(() => AsyncStorage),
            }
        )
    )
);
