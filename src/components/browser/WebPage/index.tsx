import AnimatedLottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { images } from "../../../config/constants/images";
import { localWalletInjection } from "../../../helpers/wallet/injection/localWalletInjection";
import { walletCallBackHandler } from "../../../helpers/wallet/injection/walletCallBackHandler";
import { useCurrentTabState } from "../../../state/currentTabState";
import { theme } from "../../../ui";
import { ZStack } from "../../../ui/stack";
import { processUrl } from "../../../helpers/browser/misc/processUrl";
import { ConnectWalletSheet } from "./walletActionSheet/ConnectWalletSheet";
import { SignMessageSheet } from "./walletActionSheet/SignMessageSheet";
import { SendTransactionSheet } from "./walletActionSheet/SendTransactionSheet";
import { useWalletActionState } from "../../../state/walletActionState";
import { log } from "../../../config/logger";
import { WalletBottomSheet } from "../../../ui/bottomsheet/WalletBottomSheet";
import { TypedSignMessageSheet } from "./walletActionSheet/TypedSignMessageSheet";

interface WebPageProps {
    webViewRef: React.RefObject<WebView>;
    onNavigationStateChange: (event: WebViewNavigation) => void;
}

export default function WebPage({
    webViewRef,
    onNavigationStateChange,
}: WebPageProps) {
    const currentTabState = useCurrentTabState();
    const walletActionState = useWalletActionState();
    const [isWebViewLoaded, setIsWebViewLoaded] = useState<boolean>(false);
    const [webViewClick, setOnWebViewClick] = useState<boolean>(false);
    const [walletActionSheet, setWalletActionSheet] = useState<boolean>(false);

    const handleWebViewLoad = () => {
        setIsWebViewLoaded(false);
    };

    const handleWebViewLoadEnd = () => {
        setIsWebViewLoaded(true);
    };

    if (!currentTabState.currentTab) {
        return <View style={{ flex: 1 }} />;
    }

    useEffect(() => {
        openBottomSheet();
    }, [walletActionState.walletAction]);

    const openBottomSheet = async () => {
        if (
            Object.keys(useWalletActionState.getState().walletAction.walletData)
                .length > 0
        ) {
            setWalletActionSheet(true);
        }
    };

    useEffect(() => {
        useWalletActionState.getState().clearState();
        setWalletActionSheet(false);
    }, []);

    const handleConnectWallet = (isConnected: boolean) => {
        if (isConnected) {
            setWalletActionSheet(false);
        }
    };

    useEffect(() => {
        log.debug(
            "wallet action sheet type",
            useWalletActionState.getState().walletAction.walletData.type
        );
    }, [useWalletActionState.getState().walletAction.walletData]);

    return (
        <ZStack
            width={theme.dimensions.fullWidth}
            height={"92%"}
            style={{
                backgroundColor: theme.colors.base_primary,
                flex: 1,
            }}
        >
            <WebView
                ref={webViewRef}
                containerStyle={{
                    height: theme.dimensions.fullHeight * 0.8,
                    width: theme.dimensions.fullWidth,
                    backgroundColor: theme.colors.base_primary,
                }}
                source={{
                    uri:
                        currentTabState?.currentTab?.hostname != null
                            ? currentTabState.currentTab?.url
                            : `https://www.google.com/search?q=${currentTabState.currentTab.url}`,
                }}
                style={{ flex: 1, backgroundColor: theme.colors.base_primary }}
                originWhitelist={["*"]}
                onLoad={handleWebViewLoad}
                onLoadEnd={handleWebViewLoadEnd}
                injectedJavaScript={localWalletInjection}
                onMessage={(event) => {
                    // log.debug("event.nativeEvent.data", event.nativeEvent);
                    setOnWebViewClick(!webViewClick);
                    walletCallBackHandler(event.nativeEvent.data, webViewRef);
                }}
                onNavigationStateChange={(event) => {
                    onNavigationStateChange(event);
                    const processedUrl = processUrl(event.url);
                    currentTabState.setCurrentTab(processedUrl);
                }}
                webviewDebuggingEnabled={true}
            />
            {!isWebViewLoaded && (
                <View
                    style={{
                        width: theme.dimensions.fullWidth,
                        height: theme.dimensions.fullHeight * 0.8,
                        backgroundColor: theme.colors.base_primary,
                        position: "absolute",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <AnimatedLottieView
                        source={images.webLoading}
                        autoPlay
                        loop
                        style={{
                            width: 250,
                            height: 250,
                            position: "absolute",
                        }}
                    />
                </View>
            )}
            <WalletBottomSheet
                backdropColor={theme.colors.base_primary + 70}
                trackingName={
                    useWalletActionState.getState().walletAction.walletData.type
                }
                isVisible={walletActionSheet}
                onBackdropPress={() => {
                    setWalletActionSheet(false);
                }}
            >
                {useWalletActionState.getState().walletAction.walletData
                    .type === "personal_sign" ? (
                    <SignMessageSheet onConnect={handleConnectWallet} />
                ) : useWalletActionState.getState().walletAction.walletData
                      .type === "eth_sendTransaction" ? (
                    <SendTransactionSheet onConnect={handleConnectWallet} />
                ) : useWalletActionState.getState().walletAction.walletData
                      .type === "eth_requestAccounts" ? (
                    <ConnectWalletSheet onConnect={handleConnectWallet} />
                ) : useWalletActionState.getState().walletAction.walletData
                      .type === "eth_signTypedData_v4" ? (
                    <TypedSignMessageSheet onConnect={handleConnectWallet} />
                ) : null}
            </WalletBottomSheet>
        </ZStack>
    );
}
