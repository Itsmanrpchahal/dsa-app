import { WALLET_SERVICE_API_HOST } from "@env";
import { log } from "../../../config/logger";
import { DdLogs } from "@datadog/mobile-react-native";
import axios from "axios";

export async function getEvmTransactionDetails(queueId: string): Promise<any> {
    try {
        const res = await axios.get(
            `${WALLET_SERVICE_API_HOST}/evm-blockchain/transaction-details?queueId=${queueId}`
        );
        const result = res.data;

        log.debug(
            "response from transaction details api",
            result.result.transactionResult
        );

        return result.result.transactionResult;
    } catch (error) {
        log.error(
            "Error:",
            `${WALLET_SERVICE_API_HOST}/evm-blockchain/transaction-details?queueId=${queueId}`,
            error
        );
        DdLogs.error(
            "Error fetching transaction details:",
            `${WALLET_SERVICE_API_HOST}/evm-blockchain/transaction-details?queueId=${queueId}`,
            String(error)
        );
        throw error;
    }
}
