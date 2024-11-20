import WebView from "react-native-webview";
import { ethRequestAccount } from "./ethMethods/ethRequestAccount";
import { ethAccounts } from "./ethMethods/ethAccounts";
import { walletRequestPermissions } from "./ethMethods/walletRequestPermissions";
import { ethChainId } from "./ethMethods/ethChainId";
import { switchChain } from "./ethMethods/switchChain";
import { personalSign } from "./ethMethods/personalSign";
import { netVersion } from "./ethMethods/netVersion";
import { log } from "../../../../config/logger";
import { ethBlockNumber } from "./ethMethods/ethBlockNumber";
import { ethEstimateGas } from "./ethMethods/ethEstimateGas";
import { ethSendTransaction } from "./ethMethods/ethSendTransaction";
import { ethGetTransactionByHash } from "./ethMethods/ethGetTransactionByHash";
import { ethSignTypedDatav4 } from "./ethMethods/ethSignTypedDatav4";

export async function walletCallBackHandler(
    action: any,
    webViewRef: React.RefObject<WebView<{}>>,
    params?: any
) {
    const requestData = JSON.parse(action);

    switch (requestData.type) {
        case "eth_requestAccounts":
            const responseScript = await ethRequestAccount();
            webViewRef.current?.injectJavaScript(responseScript);
            break;
        case "eth_accounts":
            const responseScriptAccounts = await ethAccounts();
            webViewRef.current?.injectJavaScript(responseScriptAccounts);
            break;
        case "wallet_requestPermissions":
            const responseScriptPermissions = await walletRequestPermissions();
            webViewRef.current?.injectJavaScript(responseScriptPermissions);
            break;
        case "eth_chainId":
            const responseScriptChainId = await ethChainId();
            webViewRef.current?.injectJavaScript(responseScriptChainId);
            break;
        case "net_version":
            const responseScriptNetVersion = await netVersion();
            webViewRef.current?.injectJavaScript(responseScriptNetVersion);
            break;
        case "wallet_switchEthereumChain":
            if (requestData?.params) {
                const responseScriptSwitchChain = await switchChain(
                    requestData.params[0].chainId
                );
                webViewRef.current?.reload();
                webViewRef.current?.injectJavaScript(responseScriptSwitchChain);
            }
            break;
        case "personal_sign":
            if (requestData?.params) {
                const responseScriptSign = await personalSign(
                    requestData.params[0]
                );
                webViewRef.current?.injectJavaScript(responseScriptSign);
            }
            break;
        case "eth_blockNumber":
            log.debug("eth_blockNumber", requestData);
            const responseScriptBlockNumber = await ethBlockNumber();
            log.debug("responseScriptBlockNumber", responseScriptBlockNumber);
            webViewRef.current?.injectJavaScript(responseScriptBlockNumber);
            break;
        case "web3_clientVersion":
            log.debug("web3_clientVersion", requestData);
            // implementation delayed, no direct way to access service provider's node client version
            break;
        case "eth_estimateGas":
            log.debug("eth_estimateGas data", requestData.params[0]);
            const txnParams = requestData.params[0];
            const responseScriptEstimateGas = await ethEstimateGas(
                txnParams ?? {}
            );
            webViewRef.current?.injectJavaScript(responseScriptEstimateGas);
            break;
        case "eth_sendTransaction":
            log.debug("eth_sendTransaction", requestData.params[0]);
            const txn = requestData.params[0];
            const requestUserConfirmation = await ethSendTransaction(txn);
            webViewRef.current?.injectJavaScript(requestUserConfirmation);
            break;
        case "eth_getTransactionByHash":
            const txnHash = requestData.params[0];
            const responseTransactionByHash = await ethGetTransactionByHash(
                txnHash
            );
            webViewRef.current?.injectJavaScript(responseTransactionByHash);
            break;
        case "eth_signTypedData_v4":
            if (requestData?.params) {
                log.debug("eth_signTypedData_v4 params", requestData.params);
                const responseScriptSign = await ethSignTypedDatav4(
                    requestData.params[1]
                );
                webViewRef.current?.injectJavaScript(responseScriptSign);
            }
            break;
        default:
            log.debug("Unknown ethereum method called", requestData);
            break;
    }
}
