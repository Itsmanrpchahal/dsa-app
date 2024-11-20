import { Alert } from "react-native";
import { log } from "../../../../../config/logger";
import { segmentClient } from "../../../../../config/segmentClient";
import { useConnectedDappsState } from "../../../../../state/connectedDappsState";
import { useCurrentTabState } from "../../../../../state/currentTabState";
import { useSupportedChainsState } from "../../../../../state/supportedChainsState";

export async function switchChain(chainId: string): Promise<any> {
    const supportedChains =
        useSupportedChainsState.getState().supportedChains.chains;

    if (
        !supportedChains ||
        !supportedChains.find((obj) => obj.chainIdHex === chainId)
    ) {
        const errorMessage = `${chainId} not supported, coming soon`;
        Alert.alert("Error", errorMessage);
        segmentClient.track("Unsupported Chain Requested", { chainId });
        throw new Error(errorMessage);
    }

    const currentHostUrl = await useCurrentTabState.getState().currentTab
        ?.hostNameUrl;

    if (!currentHostUrl) {
        return;
    }

    log.debug("Switching chain to", chainId);

    await useConnectedDappsState
        .getState()
        .updateDappChainId(currentHostUrl, chainId);

    setTimeout(() => {
        const connectedDapps = useConnectedDappsState.getState().connectedDapps;
        const lastItem = connectedDapps[connectedDapps.length - 1];
        log.debug("first item", connectedDapps[0]);
        log.debug("lenfth", connectedDapps.length);
        log.debug("Last item of the array:", lastItem);
    }, 1000);

    const responseScript = `
        window.dispatchEvent(new MessageEvent('message', { data: { type: 'wallet_switchEthereumChain', response:
            null
     } }));
    `;

    return responseScript;
}
