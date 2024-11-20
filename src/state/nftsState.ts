import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";


export type Chain = {
    chain_id: string;
    chain_name: string;
    items: ChainItems[];
} & Record<string, any>;

export type ChainItems = {
    contract_name: string;
    contract_ticker_symbol: string;
    floor_price_quote: string;
    pretty_floor_price_quote: number;
    floor_price_native_quote: string;
    balance: string;
    nft_data: Nft_Data[];
} & Record<string, any>;

export type Nft_Data = {
    token_id: string;
    name: string;
    media: Media;
}

export type Media = {
    image: string;
    image_256: string;
}

export type Nfts = {
    chains: Chain[] | [];
    chainItems: ChainItems[] | [];
    nft_data: Nft_Data[] | [];
};
interface NftsState {
    nfts: Nfts;
    setNfts: (nfts: Nfts) => void;
    clearState: () => void;
}

export const useNftsState = create<NftsState>()(
    devtools(
        persist(
            (set) => ({
                nfts: {
                    chains: [],
                    chainItems: [],
                    nft_data: []
                },
                setNfts: (nfts: Nfts) => set({ nfts }),
                clearState: () =>
                    set({
                        nfts: {
                            chains: [],
                            chainItems: [],
                            nft_data: []
                        },
                    }),
            }),
            {
                name: "nfts-storage",
                storage: createJSONStorage(() => AsyncStorage),
            }
        )
    )
);
