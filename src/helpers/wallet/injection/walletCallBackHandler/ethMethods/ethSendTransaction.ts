import { Alert } from "react-native";
import { getPersonalSignature } from "../../../api/getPersonalSignature";
import { log } from "../../../../../config/logger";
import { getStringFromHex } from "../../../api/getStringFromHex";
import { sendEvmTransaction } from "../../../api/sendEvmTransaction";
import { EvmTransactionDataType } from "../../../../../types";
import { getSignedTransaction } from "../../../api/getSignedTransaction";
import { getEvmTransactionDetails } from "../../../api/getEvmTransactionDetails";
import { useWalletActionState } from "../../../../../state/walletActionState";
import * as Burnt from "burnt";

export async function ethSendTransaction(
    txn: EvmTransactionDataType
): Promise<string> {
    log.debug("ethSendTransaction", txn);

    const requestUserConfirmation = async () =>
        new Promise<string>((resolve, reject) => {
            useWalletActionState.getState().setWalletAction({
                title: "eth_sendTransaction",
                message: "eth_sendTransaction",
                type: "eth_sendTransaction",
                transactionData: txn,
                negativeButtonText: "Cancel",
                positiveButtonText: "Approve",
                onPositivePress: async () => {
                    try {
                        Burnt.alert({
                            title: "Transaction In Process",
                            message: "",
                            preset: "spinner",
                            duration: 60,
                        });
                        log.debug("txn", txn);
                        const queueId = await sendEvmTransaction(txn);

                        log.debug("queue Id yay", queueId);

                        let intervalId: NodeJS.Timeout | null = null;
                        let timeoutId: NodeJS.Timeout | null = null;

                        intervalId = setInterval(async () => {
                            const txDetails = await getEvmTransactionDetails(
                                queueId
                            );

                            if (
                                (txDetails?.txHash ||
                                    txDetails?.transactionHash) &&
                                (
                                    txDetails.txHash ||
                                    txDetails.transactionHash
                                ).startsWith("0x")
                            ) {
                                clearInterval(intervalId!);
                                clearTimeout(timeoutId!);
                                const responseScript = `
                                            window.dispatchEvent(new MessageEvent('message', { data: { type: 'eth_sendTransaction', transactionHash:
                                                ${
                                                    txDetails?.txHash ??
                                                    txDetails?.transactionHash
                                                }
                                            } }));
                                        `;
                                resolve(responseScript);
                                Burnt.dismissAllAlerts();
                                Burnt.toast({
                                    title: "Successful",
                                    message: "",
                                    preset: "done",
                                });
                                useWalletActionState.getState().clearState();
                            }
                        }, 1500);

                        timeoutId = setTimeout(() => {
                            clearInterval(intervalId!);
                            reject(
                                new Error(
                                    "Timeout: Condition not satisfied within 60 seconds"
                                )
                            );
                        }, 60000);
                    } catch (error) {
                        reject(error);
                    }
                },
                onNegativePress: () => {
                    resolve("");
                    Burnt.dismissAllAlerts();
                    Burnt.toast({
                        title: "Failed",
                        message: "",
                        preset: "error",
                    });
                    useWalletActionState.getState().clearState();
                },
            });

            // Alert.alert(
            //     "Transaction Request",
            //     "Do you want to do this transaction with dAppStore wallet?",
            //     [
            //         {
            //             text: "Cancel",
            //             onPress: () => {
            //                 resolve("");
            //             },
            //             style: "cancel",
            //         },
            //         {
            //             text: "Approve",
            //             onPress: async () => {
            //                 try {
            //                     const queueId = await sendEvmTransaction(txn);

            //                     log.debug("queue Id yay", queueId);

            //                     let intervalId: NodeJS.Timeout | null = null;
            //                     let timeoutId: NodeJS.Timeout | null = null;

            //                     intervalId = setInterval(async () => {
            //                         const txDetails =
            //                             await getEvmTransactionDetails(queueId);

            //                         if (
            //                             (txDetails?.txHash ||
            //                                 txDetails?.transactionHash) &&
            //                             (
            //                                 txDetails.txHash ||
            //                                 txDetails.transactionHash
            //                             ).startsWith("0x")
            //                         ) {
            //                             clearInterval(intervalId!);
            //                             clearTimeout(timeoutId!);
            //                             const responseScript = `
            //                                 window.dispatchEvent(new MessageEvent('message', { data: { type: 'eth_sendTransaction', transactionHash:
            //                                     ${
            //                                         txDetails?.txHash ??
            //                                         txDetails?.transactionHash
            //                                     }
            //                                 } }));
            //                             `;
            //                             resolve(responseScript);
            //                         }
            //                     }, 1500);

            //                     timeoutId = setTimeout(() => {
            //                         clearInterval(intervalId!);
            //                         reject(
            //                             new Error(
            //                                 "Timeout: Condition not satisfied within 60 seconds"
            //                             )
            //                         );
            //                     }, 60000);
            //                 } catch (error) {
            //                     reject(error);
            //                 }
            //             },
            //         },
            //     ]
            // );
        });

    return requestUserConfirmation();
}
