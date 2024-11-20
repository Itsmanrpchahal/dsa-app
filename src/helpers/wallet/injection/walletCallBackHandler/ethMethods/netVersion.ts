import { Alert } from "react-native";
import { useConnectedDappsState } from "../../../../../state/connectedDappsState";
import { useCurrentTabState } from "../../../../../state/currentTabState";
import { useSupportedChainsState } from "../../../../../state/supportedChainsState";

export async function netVersion(): Promise<string> {
    const currentHostUrl = await useCurrentTabState.getState().currentTab
        ?.hostNameUrl;

    const currentChainId =
        (await useConnectedDappsState
            .getState()
            .connectedDapps.find((dapp) => dapp.dappHostUrl === currentHostUrl)
            ?.chainId) ?? "0x1";

    const supportedChains =
        useSupportedChainsState.getState().supportedChains.chains;
    const matchedChain = supportedChains
        ? supportedChains.find((chain) => chain.chainIdHex === currentChainId)
        : null;

    if (!matchedChain) {
        Alert.alert("Supported chain not found");
        throw new Error("Supported chain not found");
    }

    const netVersion = matchedChain.chainId;

    const responseScript = `
        window.dispatchEvent(new MessageEvent('message', { data: { type: 'net_version', net_version: ${netVersion} } }));
    `;

    return responseScript;
}
