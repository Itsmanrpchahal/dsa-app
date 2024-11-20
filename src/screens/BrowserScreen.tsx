import { createRef, useState } from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import BrowserControls from "../components/browser/BrowserControls";
import Discover from "../components/browser/Discover";
import WebPage from "../components/browser/WebPage";
import { useCurrentTabState } from "../state/currentTabState";
import { TabStackScreen } from "../ui/screens";
import { YStack } from "../ui/stack";
import React from "react";

const MemoizedDiscover = React.memo(Discover);

export default function BrowserScreen() {
    const webViewRef = createRef<WebView>();
    const [webViewNavigationEvent, setWebViewNavigationEvent] =
        useState<any>(null);
    const currentTabState = useCurrentTabState();

    const handleNavigationStateChange = (event: WebViewNavigation) => {
        setWebViewNavigationEvent(event);
    };

    return (
        <TabStackScreen trackingName="Browser Screen">
            <SafeAreaView style={{ flex: 1 }}>
                <YStack
                    width={"100%"}
                    justifyContent={"space-between"}
                    alignItems={"stretch"}
                    style={{
                        flex: 1,
                        paddingTop: StatusBar.currentHeight,
                    }}
                >
                    {currentTabState.currentTab === null ? (
                        <MemoizedDiscover />
                    ) : (
                        <WebPage
                            webViewRef={webViewRef}
                            onNavigationStateChange={
                                handleNavigationStateChange
                            }
                        />
                    )}
                    <BrowserControls
                        webViewRef={webViewRef}
                        webViewNavigationEvent={webViewNavigationEvent}
                    />
                </YStack>
            </SafeAreaView>
        </TabStackScreen>
    );
}
