// ethSignTypedDatav4

import { log } from "../../../../../config/logger";
import { useWalletActionState } from "../../../../../state/walletActionState";
import { getPersonalSignature } from "../../../api/getPersonalSignature";
import { getTypedSignature } from "../../../api/getTypedSignature";

export async function ethSignTypedDatav4(data: any): Promise<string> {
    log.debug("eth_signTypedData_v4", data);

    const requestUserConfirmation = () =>
        new Promise<string>((resolve, reject) => {
            useWalletActionState.getState().setWalletAction({
                title: "ethSignTypedDatav4",
                message: "ethSignTypedDatav4",
                type: "eth_signTypedData_v4",
                data: data,
                negativeButtonText: "Cancel",
                positiveButtonText: "Sign",
                onPositivePress: async () => {
                    try {
                        const signature = await getTypedSignature(
                            JSON.parse(data)
                        );

                        const responseScript = `
                        window.dispatchEvent(new MessageEvent('message', { data: { type: 'eth_signTypedData_v4', signature: ${JSON.stringify(
                            signature
                        )} } }));
                    `;

                        resolve(responseScript);

                        useWalletActionState.getState().clearState();
                    } catch (error) {
                        reject(error);
                        useWalletActionState.getState().clearState();
                    }
                },
                onNegativePress: () => {
                    resolve("");
                    useWalletActionState.getState().clearState();
                },
            });
        });

    return requestUserConfirmation();
}
