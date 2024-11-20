import axios from "axios";
import { log } from "../../../config/logger";
import { WALLET_SERVICE_API_HOST } from "@env";
import { useUserState } from "../../../state/userState";

export interface TransferTokensFromWalletProps {
    toAddress: string;
    amount: string;
    currencyAddress: string;
    chainSlug: string;
}

export async function transferTokensFromWallet(
    transferDetails: TransferTokensFromWalletProps
): Promise<string> {
    try {
        const response = await axios.post(
            `${WALLET_SERVICE_API_HOST}/evm-wallet/transfer-tokens`,
            {
                uniqueUserId: useUserState.getState().userDetails.uuid,
                to: transferDetails.toAddress,
                amount: transferDetails.amount,
                currencyAddress: transferDetails.currencyAddress,
                chain: transferDetails.chainSlug,
            }
        );

        log.debug(
            "response from transfer tokens transaction api",
            String(response)
        );
        const result = response.data;
        const transactionDetails = result.queueId;

        log.debug("transfer tokens queue id", transactionDetails?.queueId);

        return transactionDetails?.queueId;
    } catch (error) {
        log.error(error);
        throw new Error("Failed to send transfer tokens transaction");
    }
}
