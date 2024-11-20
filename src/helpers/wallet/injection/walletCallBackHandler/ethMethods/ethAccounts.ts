import { useUserState } from "../../../../../state/userState";

export async function ethAccounts(): Promise<string> {
    const walletAddress =
        (await useUserState.getState().userDetails?.publicEvmAddress) || "";
    const accounts = JSON.stringify([walletAddress]);

    const responseScript = `
        window.dispatchEvent(new MessageEvent('message', { data: { type: 'eth_accounts', accounts: ${JSON.stringify(
            accounts
        )} } }));
    `;

    return responseScript;
}
