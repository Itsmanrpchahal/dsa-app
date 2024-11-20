import { useUserState } from "../../../../../state/userState";

export async function walletRequestPermissions(): Promise<string> {
    const walletAddress =
        (await useUserState.getState().userDetails?.publicEvmAddress) || "";

    const accounts = JSON.stringify([walletAddress]);
    const capability = {
        eth_accounts: [walletAddress],
    };

    const responseScript = `
        window.dispatchEvent(new MessageEvent('message', { data: { type: 'wallet_requestPermissions', permissions: 
           null 
         } }));
    `;
    return responseScript;
}
