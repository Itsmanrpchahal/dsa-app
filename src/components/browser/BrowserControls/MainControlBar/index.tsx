import WebView from "react-native-webview";
import { useCurrentTabState } from "../../../../state/currentTabState";
import DiscoverControlBar from "./DiscoverControlBar";
import WebViewControlBar from "./WebViewControlBar";
import { View } from "moti";

interface MainControlBarProps {
    webViewRef: React.RefObject<WebView>;
    toggleCollapsible: () => void;
    toggleAddressBar: (value: boolean) => void;
    webViewNavigationEvent: any;
}

export default function MainControlBar({
    webViewRef,
    toggleCollapsible,
    toggleAddressBar,
    webViewNavigationEvent,
}: MainControlBarProps) {
    const currentTabState = useCurrentTabState();

    return (
        <View>
            {currentTabState.currentTab != null ? (
                <WebViewControlBar
                    toggleCollapsible={toggleCollapsible}
                    setAddressBar={toggleAddressBar}
                    useCurrentTabState={useCurrentTabState}
                    webViewRef={webViewRef}
                    webViewNavigationEvent={webViewNavigationEvent}
                />
            ) : (
                <DiscoverControlBar
                    webViewRef={webViewRef}
                    setAddressBar={toggleAddressBar}
                />
            )}
        </View>
    );
}
