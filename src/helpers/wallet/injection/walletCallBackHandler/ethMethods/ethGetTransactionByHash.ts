import { useConnectedDappsState } from "../../../../../state/connectedDappsState";
import { useCurrentTabState } from "../../../../../state/currentTabState";
import { useSupportedChainsState } from "../../../../../state/supportedChainsState";
import { EvmTransactionDataTypeOptional } from "../../../../../types";
import { getTransactionByHash } from "../../../api/getTransactionByHash";

export async function ethGetTransactionByHash(
    txnHash: string
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

    const transaction = await getTransactionByHash(txnHash, chainSlug);

    const responseScript = `
        window.dispatchEvent(new MessageEvent('message', { data: { type: 'eth_getTransactionByHash', transaction: ${JSON.stringify(
            transaction
        )} } }));
    `;

    return responseScript;
}
