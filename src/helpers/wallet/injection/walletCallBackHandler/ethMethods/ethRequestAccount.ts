import { log } from "../../../../../config/logger";
import { useConnectedDappsState } from "../../../../../state/connectedDappsState";
import { useCurrentTabState } from "../../../../../state/currentTabState";
import { useUserState } from "../../../../../state/userState";
import { useWalletActionState } from "../../../../../state/walletActionState";

export async function ethRequestAccount(): Promise<string> {
    const walletAddress =
        (await useUserState.getState().userDetails?.publicEvmAddress) || "";
    const accounts = JSON.stringify([walletAddress]);
    const requestUserConfirmation = () =>
        new Promise<string>((resolve, reject) => {
            log.debug("ethRequestAccount");
            const connectedDapps =
                useConnectedDappsState.getState().connectedDapps;
            const currentTabHostUrl =
                useCurrentTabState.getState().currentTab?.hostNameUrl;

            if (
                currentTabHostUrl &&
                connectedDapps.some(
                    (dapp) => dapp.dappHostUrl === currentTabHostUrl
                )
            ) {
                const responseScript = `
                        window.dispatchEvent(new MessageEvent('message', { data: { type: 'eth_requestAccounts', accounts: ${JSON.stringify(
                            accounts
                        )} } }));
                    `;
                resolve(responseScript);
            } else {
                useWalletActionState.getState().setWalletAction({
                    type: "eth_requestAccounts",
                    responseScript: `
                                    window.dispatchEvent(new MessageEvent('message', { data: { type: 'eth_requestAccounts', accounts: ${JSON.stringify(
                                        accounts
                                    )} } }));
                                `,
                    onPositivePress: () => {
                        try {
                            const responseScript = `
                    window.dispatchEvent(new MessageEvent('message', { data: { type: 'eth_requestAccounts', accounts: ${JSON.stringify(
                        accounts
                    )} } }));
                    `;
                            useConnectedDappsState
                                .getState()
                                .updateDappConnection(
                                    useCurrentTabState.getState().currentTab
                                        ?.hostNameUrl ??
                                        String(
                                            useConnectedDappsState.getState()
                                                .connectedDapps.length + 1
                                        ),
                                    true,
                                    "0x1"
                                );

                            resolve(responseScript);
                        } catch (error) {
                            reject(error);
                        }
                    },
                    onNegativePress: () => {
                        resolve("");
                        useWalletActionState.getState().clearState();
                    },
                });
            }
        });

    return requestUserConfirmation();
}
