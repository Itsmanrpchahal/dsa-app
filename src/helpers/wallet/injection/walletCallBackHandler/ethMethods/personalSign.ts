import { getPersonalSignature } from "../../../api/getPersonalSignature";
import { log } from "../../../../../config/logger";
import { getStringFromHex } from "../../../api/getStringFromHex";
import { useWalletActionState } from "../../../../../state/walletActionState";

export async function personalSign(data: string): Promise<string> {
    log.debug("personalSign", data);

    const convertedToString = await getStringFromHex(data);
    log.debug("convertedToString", convertedToString);

    const requestUserConfirmation = () =>
        new Promise<string>((resolve, reject) => {
            useWalletActionState.getState().setWalletAction({
                title: "personalSign",
                message: "personalSign",
                type: "personal_sign",
                personalSign: data,
                negativeButtonText: "Cancel",
                positiveButtonText: "Sign",
                onPositivePress: async () => {
                    try {
                        const signature = await getPersonalSignature(
                            convertedToString
                        );

                        const responseScript = `
                        window.dispatchEvent(new MessageEvent('message', { data: { type: 'personal_sign', signature: ${JSON.stringify(
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
