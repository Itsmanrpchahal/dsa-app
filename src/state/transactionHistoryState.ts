import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export type Chain = {
    chain_id: string;
    chain_name: string;
    items: ChainItems[];
} & Record<string, any>;

export type ChainItems = {
    pretty_value_quote: string;
    pretty_gas_quote: string;
    block_signed_at: string;
    gas_metadata: Gas_MetaData;
} & Record<string, any>;

export type Gas_MetaData = {
    contract_ticker_symbol: string;
    gas_metadata: string;
    logo_url: string;
};

export type TransactionHistory = {
    chains: Chain[] | [];
    chainItems: ChainItems[] | [];
    gas_metadata: Gas_MetaData | {};
};
interface TransactionHistoryState {
    transactionHistory: TransactionHistory;
    setTransactionHistory: (transactionHistory: TransactionHistory) => void;
    clearState: () => void;
}

export const useTransactionHistoryState = create<TransactionHistoryState>()(
    devtools(
        persist(
            (set) => ({
                transactionHistory: {
                    chains: [],
                    chainItems: [],
                    gas_metadata: {},
                },
                setTransactionHistory: (
                    transactionHistory: TransactionHistory
                ) => set({ transactionHistory }),
                clearState: () =>
                    set({
                        transactionHistory: {
                            chains: [],
                            chainItems: [],
                            gas_metadata: {},
                        },
                    }),
            }),
            {
                name: "transactionHistory-storage",
                storage: createJSONStorage(() => AsyncStorage),
            }
        )
    )
);
