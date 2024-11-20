import { WALLET_SERVICE_API_HOST } from "@env";
import { log } from "../../../config/logger";
import { DdLogs } from "@datadog/mobile-react-native";
import { useTransactionHistoryState } from "../../../state/transactionHistoryState";
import { useUserState } from "../../../state/userState";

export async function getTransactionHistory() {
    const userUuid = useUserState.getState().userDetails.uuid;

    if (!userUuid || typeof userUuid !== "string") {
        log.error("Invalid UUID: Exiting getFeed function");
        return [];
    }
    try {
        const res = await fetch(
            `${WALLET_SERVICE_API_HOST}/user/transaction-history?uniqueUserId=${userUuid}`
        );
        const response = await res.json();
        const chains = response.data;
        useTransactionHistoryState.getState().setTransactionHistory(chains);

        return chains;
    } catch (error) {
        log.error(
            "Error:",
            `${WALLET_SERVICE_API_HOST}/evm-blockchain/chains`,
            error
        );
        DdLogs.error(
            "Error fetching transaction history chains:",
            `${WALLET_SERVICE_API_HOST}/evm-blockchain/chains`,
            String(error)
        );
        throw error;
    }
}
