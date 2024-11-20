import { log } from "../../../../../config/logger";
import { useConnectedDappsState } from "../../../../../state/connectedDappsState";
import { useCurrentTabState } from "../../../../../state/currentTabState";

export async function ethChainId(): Promise<string> {
    const currentHostUrl = await useCurrentTabState.getState().currentTab
        ?.hostNameUrl;

    const currentChainId =
        (await useConnectedDappsState
            .getState()
            .connectedDapps.find((dapp) => dapp.dappHostUrl === currentHostUrl)
            ?.chainId) ?? "0x1";

    log.debug("current chain Id", currentHostUrl, currentChainId);

    const responseScript = `
        window.dispatchEvent(new MessageEvent('message', { data: { type: 'eth_chainId', chainId: ${JSON.stringify(
            currentChainId
        )}
         } }));
    `;

    return responseScript;
}
