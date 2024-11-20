import { useUserState } from "../../../state/userState";

declare global {
    interface Window {
        ethereum: any;
        ReactNativeWebView: any;
    }
}

const walletAddress = useUserState.getState().userDetails?.publicEvmAddress;

export const localWalletInjection = `window.ethereum = {
        provider: {},
        enable: async () => {},
        isClientConnected: false,
        on: async (message) => { if(message === 'connect') { return ${[
            walletAddress,
        ]} }; },
        request: async ({ method, params }) => {
            switch (method) {
                case 'eth_requestAccounts':
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'eth_requestAccounts' }));
                    return new Promise((resolve, reject) => {
                        window.addEventListener('message', (event) => {
                            if (event.data && event.data.type === 'eth_requestAccounts') {
                                resolve(JSON.parse(event.data.accounts));
                            }
                        });
                    });
                case 'eth_accounts':
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'eth_accounts' }));
                    return new Promise((resolve, reject) => {
                        window.addEventListener('message', (event) => {
                            if (event.data && event.data.type === 'eth_accounts') {
                                resolve(JSON.parse(event.data.accounts));
                            }
                        });
                    });
                case 'wallet_requestPermissions':
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'wallet_requestPermissions' }));
                    return new Promise((resolve, reject) => {
                        window.addEventListener('message', (event) => {
                            if (event.data && event.data.type === 'wallet_requestPermissions') {
                                resolve(event.data.permissions);
                            }
                        });
                    });
                case 'eth_chainId':
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'eth_chainId' }));
                    return new Promise((resolve, reject) => {
                        window.addEventListener('message', (event) => {
                            if (event.data && event.data.type === 'eth_chainId') {
                                resolve(event.data.chainId);
                            }
                        });
                    });
                case 'wallet_switchEthereumChain':
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'wallet_switchEthereumChain', params: params}));
                    return new Promise((resolve, reject) => {
                        window.addEventListener('message', (event) => {
                            if (event.data && event.data.type === 'wallet_switchEthereumChain') {
                                resolve(event.data.response);
                            }
                        });
                    });
                case 'eth_blockNumber':
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'eth_blockNumber' }));
                    return new Promise((resolve, reject) => {
                        window.addEventListener('message', (event) => {
                            if (event.data && event.data.type === 'eth_blockNumber') {
                                resolve(event.data.blockNumber);
                            }
                        });
                    });
                case 'personal_sign':
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'personal_sign', params: params}));
                    return new Promise((resolve, reject) => {
                        window.addEventListener('message', (event) => {
                            if (event.data && event.data.type === 'personal_sign') {
                                resolve(event.data.signature);
                            }
                        });
                    });
                case 'eth_estimateGas':
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'eth_estimateGas', params: params}));
                    return new Promise((resolve, reject) => {
                        window.addEventListener('message', (event) => {
                            if (event.data && event.data.type === 'eth_estimateGas') {
                                resolve(event.data.gas);
                            }
                        });
                    });
                case 'eth_sendTransaction':
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'eth_sendTransaction', params: params}));
                    return new Promise((resolve, reject) => {
                        window.addEventListener('message', (event) => {
                            if (event.data && event.data.type === 'eth_sendTransaction') {
                                resolve(event.data.transactionHash);
                            }
                        });
                    });
                case 'eth_getTransactionByHash':
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'eth_getTransactionByHash', params: params}));
                    return new Promise((resolve, reject) => {
                        window.addEventListener('message', (event) => {
                            if (event.data && event.data.type === 'eth_getTransactionByHash') {
                                resolve(JSON.parse(event.data.transaction));
                            }
                        });
                    });
                case 'eth_signTypedData_v4':
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'eth_signTypedData_v4', params: params}));
                    return new Promise((resolve, reject) => {
                        window.addEventListener('message', (event) => {
                            if (event.data && event.data.type === 'eth_signTypedData_v4') {
                                resolve(event.data.signature);
                            }
                        });
                    });
                default:
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: method }));
                    throw new Error('Method not implemented');
            }
        },
    };
    true;`;
