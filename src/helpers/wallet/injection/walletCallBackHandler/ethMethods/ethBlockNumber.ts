import { log } from "../../../../../config/logger";
import { useConnectedDappsState } from "../../../../../state/connectedDappsState";
import { useCurrentTabState } from "../../../../../state/currentTabState";
import { getChainBlockNumber } from "../../../api/getChainBlockNumber";

export async function ethBlockNumber(): Promise<string> {
    const currentHostUrl = await useCurrentTabState.getState().currentTab
        ?.hostNameUrl;

    const currentChainId =
        (await useConnectedDappsState
            .getState()
            .connectedDapps.find((dapp) => dapp.dappHostUrl === currentHostUrl)
            ?.chainId) ?? "0x1";

    const blockNumber = await getChainBlockNumber(currentChainId);

    log.debug("Block number", currentChainId, blockNumber);

    const responseScript = `
        window.dispatchEvent(new MessageEvent('message', { data: { type: 'eth_blockNumber', blockNumber: ${blockNumber} } }));
    `;

    return responseScript;
}
