import { WALLET_SERVICE_API_HOST } from "@env";
import { log } from "../../../config/logger";
import { DdLogs } from "@datadog/mobile-react-native";
import { useSupportedChainsState } from "../../../state/supportedChainsState";

export async function getSupportedChains() {
    try {
        const res = await fetch(
            `${WALLET_SERVICE_API_HOST}/evm-blockchain/chains`
        );
        const response = await res.json();
        const chains = response.chains;

        useSupportedChainsState.getState().setSupportedChains({ chains });

        return chains;
    } catch (error) {
        log.error(
            "Error:",
            `${WALLET_SERVICE_API_HOST}/evm-blockchain/chains`,
            error
        );
        DdLogs.error(
            "Error fetching supported chains:",
            `${WALLET_SERVICE_API_HOST}/evm-blockchain/chains`,
            String(error)
        );
        throw error;
    }
}
