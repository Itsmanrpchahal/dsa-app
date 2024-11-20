import axios from "axios";
import { log } from "../../../config/logger";
import { WALLET_SERVICE_API_HOST } from "@env";
import { useUserState } from "../../../state/userState";
import { EvmTransactionDataTypeOptional } from "../../../types";

export async function getGasEstimate(
    txnParams: EvmTransactionDataTypeOptional,
    chainSlug: string
): Promise<any> {
    try {
        const response = await axios.post(
            `${WALLET_SERVICE_API_HOST}/evm-blockchain/gas-estimate`,
            {
                uniqueUserId: useUserState.getState().userDetails.uuid,
                transaction: txnParams,
                chain: chainSlug,
            }
        );
        log.debug("response from gas estimate api", String(response));
        const result = response.data;
        const gasEstimate = result.gasEstimate;
        const humanReadableGasEstimate = result.humanReadableGasEstimate;

        log.debug("gas estimate", gasEstimate);

        return {
            humanReadableGasEstimate: humanReadableGasEstimate,
            gasEstimate: gasEstimate,
        };
    } catch (error) {
        log.error(error);
        throw new Error("Failed to get gas estimate for a transaction");
    }
}
