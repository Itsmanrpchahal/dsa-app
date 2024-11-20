import { log } from "../../../../../config/logger";
import { useConnectedDappsState } from "../../../../../state/connectedDappsState";
import { useCurrentTabState } from "../../../../../state/currentTabState";
import { useSupportedChainsState } from "../../../../../state/supportedChainsState";
import { EvmTransactionDataTypeOptional } from "../../../../../types";
import { getGasEstimate } from "../../../api/getGasEstimate";

export async function ethEstimateGas(
    txnParams: EvmTransactionDataTypeOptional
): Promise<string> {
    const currentHostUrl = await useCurrentTabState.getState().currentTab
        ?.hostNameUrl;

    const supportedChains =
        useSupportedChainsState.getState().supportedChains.chains;

    const currentChainId =
        (await useConnectedDappsState
            .getState()
            .connectedDapps.find((dapp) => dapp.dappHostUrl === currentHostUrl)
            ?.chainId) ?? "0x1";

    const chainSlug: string = supportedChains
        ? supportedChains.find((chain) => chain.chainIdHex === currentChainId)
              ?.slug ?? ""
        : "";

    const gasEstimate = await getGasEstimate(txnParams, chainSlug);

    log.debug("gas estimate in ethEstimateGas", gasEstimate.gasEstimate.hex);

    const responseScript = `
        window.dispatchEvent(new MessageEvent('message', { data: { type: 'eth_estimateGas', gas: ${gasEstimate.gasEstimate.hex} } }));
    `;

    return responseScript;
}
