import { WALLET_SERVICE_API_HOST } from "@env";
import axios from "axios";
import { log } from "../../../config/logger";
import { useConnectedDappsState } from "../../../state/connectedDappsState";
import { useCurrentTabState } from "../../../state/currentTabState";
import { useSupportedChainsState } from "../../../state/supportedChainsState";
import { useUserState } from "../../../state/userState";
import { EvmTransactionDataType } from "../../../types";
import { getGasEstimate } from "./getGasEstimate";

export async function getSignedTransaction(
    transaction: EvmTransactionDataType
): Promise<string> {
    try {
        const supportedChains =
            useSupportedChainsState.getState().supportedChains;

        const currentHostUrl = await useCurrentTabState.getState().currentTab
            ?.hostNameUrl;

        const currentChainId =
            (await useConnectedDappsState
                .getState()
                .connectedDapps.find(
                    (dapp) => dapp.dappHostUrl === currentHostUrl
                )?.chainId) ?? "0x1";

        if (!transaction.chainId) {
            transaction.chainId = supportedChains?.chains?.find(
                (chain) => chain.chainIdHex === currentChainId
            )?.chainId;
        }

        if (transaction.gas || transaction.gasLimit) {
            if (transaction.gas) {
                transaction.gasLimit = transaction.gas;
                delete transaction.gas;
            }
        } else {
            const chainSlug: string =
                supportedChains?.chains?.find(
                    (chain) => chain.chainIdHex === currentChainId
                )?.slug ?? "";

            const gasEstimate = await getGasEstimate(transaction, chainSlug);

            transaction.gasLimit = gasEstimate.gasEstimate.hex;
        }

        log.debug("final transaction before signing", transaction);

        const response = await axios.post(
            `${WALLET_SERVICE_API_HOST}/evm-wallet/sign-transaction`,
            {
                uniqueUserId: useUserState.getState().userDetails.uuid,
                transaction: transaction,
            }
        );
        log.debug("response from sign transaction api", String(response));
        const result = response.data;
        const signedTransaction = result?.signature;

        log.debug("signed transaction", signedTransaction?.signature);

        return signedTransaction?.signature;
    } catch (error) {
        log.error(error);
        throw new Error("Failed to sign transaction");
    }
}
