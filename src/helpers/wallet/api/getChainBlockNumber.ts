import axios from "axios";
import { log } from "../../../config/logger";
import { WALLET_SERVICE_API_HOST } from "@env";
import { useSupportedChainsState } from "../../../state/supportedChainsState";

export async function getChainBlockNumber(chainId: string): Promise<number> {
    try {
        const supportedChains =
            useSupportedChainsState.getState().supportedChains.chains;

        const chainSlug = supportedChains
            ? supportedChains.find((chain) => chain.chainIdHex === chainId)
                  ?.slug
            : null;

        if (!chainSlug) {
            throw new Error("Chain not found");
        }

        const response = await axios.get(
            `${WALLET_SERVICE_API_HOST}/evm-blockchain/block-number?chain=${chainSlug}`
        );

        const data = await response.data;

        return data.block;
    } catch (error) {
        log.error("error getting block number", error);
        throw new Error("Failed to get block number");
    }
}
