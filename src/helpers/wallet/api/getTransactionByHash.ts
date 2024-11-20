import axios from "axios";
import { log } from "../../../config/logger";
import { WALLET_SERVICE_API_HOST } from "@env";

export async function getTransactionByHash(
    txnHash: string,
    chain: string
): Promise<any> {
    try {
        const response = await axios.get(
            `${WALLET_SERVICE_API_HOST}/evm-blockchain/transaction-details-by-hash?hash=${txnHash}&chan=${chain}`
        );
        log.debug("response from get txn by hash api", String(response));
        const result = response.data;
        const transaction = result.transaction;

        log.debug("transaction", transaction);

        return transaction;
    } catch (error) {
        log.error(error);
        throw new Error("Failed to get txn by hash");
    }
}
