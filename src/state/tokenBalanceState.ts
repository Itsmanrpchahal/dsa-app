import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export type TokenBalanceUsd = {
    totalBalanceUsd: number;
} & Record<string, any>;

export type Chain = {
    chain_id: string;
    chain_name: string;
    items: ChainItems[];
} & Record<string, any>;

export type ChainItems = {
    contract_name: string;
    contract_ticker_symbol: string;
    balance: string;
    balanceUsd: number;
    pretty_balanceUsd: string;
    logo_urls:LogoUrls;
} & Record<string, any>;

export type LogoUrls = {
    token_logo_url: string;
    protocol_logo_url: string;
    chain_logo_url: string;
}
export type TokenBalances = {
    totalBalanceUsd: number | null;
    chains: Chain[] | [];
    chainItems: ChainItems[] | [];
};

interface TokenBalancesState {
    tokenBalances: TokenBalances;
    setTokenBalances: (tokenBalances: TokenBalances) => void;
    clearState: () => void;
}

export const useTokenBalancesState = create<TokenBalancesState>()(
    devtools(
        persist(
            (set) => ({
                tokenBalances: {
                    totalBalanceUsd: null,
                    chains: [],
                    chainItems:[]
                },
                setTokenBalances: (tokenBalances: TokenBalances) =>
                    set({ tokenBalances :tokenBalances}),
                clearState: () => set({ tokenBalances: {totalBalanceUsd:null, chains: [] ,chainItems:[]} }),
            }),
            {
                name: "tokenBalances-storage",
                storage: createJSONStorage(() => AsyncStorage),
            }
        )
    )
);
