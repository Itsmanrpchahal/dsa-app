import { WALLET_SERVICE_API_HOST } from "@env";
import axios from "axios";
import { log } from "../../../config/logger";
import { useConnectedDappsState } from "../../../state/connectedDappsState";
import { useCurrentTabState } from "../../../state/currentTabState";
import { useSupportedChainsState } from "../../../state/supportedChainsState";
import { useUserState } from "../../../state/userState";
import { EvmTransactionDataType } from "../../../types";

export async function sendEvmTransaction(
    txDetails: EvmTransactionDataType
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

        if (!currentChainId) {
            throw new Error("Chain not found");
        }

        if (!supportedChains || !supportedChains?.chains) {
            throw new Error("Supported chains not found");
        }

        log.debug("sending txDetails", txDetails.to, txDetails.value);

        const response = await axios.post(
            `${WALLET_SERVICE_API_HOST}/evm-wallet/send-transaction`,
            {
                uniqueUserId: useUserState.getState().userDetails.uuid,
                toAddress: txDetails.to,
                value: txDetails.value,
                data: txDetails.data ?? "",
                chain: supportedChains?.chains?.find(
                    (chain) => chain.chainIdHex === currentChainId
                )?.slug,
            }
        );
        log.debug("response from send transaction api", String(response));
        const result = response.data;
        const transactionHash = result.queueId;

        log.debug("transaction hash", transactionHash?.queueId);

        return transactionHash?.queueId;
    } catch (error) {
        log.error(error);
        throw new Error("Failed to send transaction");
    }
}
