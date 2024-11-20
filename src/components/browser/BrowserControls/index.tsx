import { MotiView } from "moti";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { BROWSER_INPUT_BAR_HEIGHT } from "../../../config/constants/dimensions";
import { theme } from "../../../ui";
import { BottomSheetRefProps } from "../../../ui/bottomsheet";
import { YStack } from "../../../ui/stack";
import DiscoverSearch from "./DiscoverSearch";
import MainControlBar from "./MainControlBar";
import WalletConnectionStatusBar from "./WalletConnectionStatusBar";
import { useCurrentTabState } from "../../../state/currentTabState";

interface BrowserControlsProps {
    webViewRef: React.RefObject<WebView>;
    webViewNavigationEvent: WebViewNavigation;
}

export default function BrowserControls({
    webViewRef,
    webViewNavigationEvent,
}: BrowserControlsProps) {
    const styles = StyleSheet.create({
        motiView: {
            borderTopLeftRadius: theme.spacing.$2,
            borderTopRightRadius: theme.spacing.$2,
        },
    });

    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showWalletSheet, setShowWalletSheet] = useState(false);
    const [sheet, setSheet] = useState<boolean>(false);
    const bottomSheetRef = useRef<BottomSheetRefProps>(null);
    const currentTabState = useCurrentTabState();

    const toggleCollapsible = () => {
        setIsCollapsed(!isCollapsed);
        setTimeout(
            () => {
                setShowWalletSheet(!showWalletSheet);
            },
            isCollapsed ? 200 : 0
        );
    };

    const toggleAddressBar = async () => {
        setIsCollapsed(false);
        await setSheet(!sheet);
        setSheet(true);
        onPress();
    };

    const onPress = useCallback(() => {
        const isActive = bottomSheetRef?.current?.isActive();
        if (isActive) {
            bottomSheetRef?.current?.scrollTo(0);
            setSheet(!sheet);
        } else {
            bottomSheetRef?.current?.scrollTo(
                -theme.dimensions.fullHeight * 0.8
            );
        }
    }, []);

    useEffect(() => {
        currentTabState.currentTab === null && setIsCollapsed(false);
    }, [currentTabState]);

    return (
        <YStack
            justifyContent={"flex-start"}
            alignItems={"center"}
            width={theme.dimensions.fullWidth}
            style={{
                height: BROWSER_INPUT_BAR_HEIGHT,
            }}
        >
            <YStack
                justifyContent={"space-between"}
                alignItems={"flex-end"}
                width={theme.dimensions.fullWidth}
                style={{
                    position: "absolute",
                    bottom: 0,
                }}
            >
                <MotiView
                    from={isCollapsed ? { translateY: 100 } : { translateY: 0 }}
                    animate={
                        isCollapsed
                            ? {
                                  translateY: 0,
                              }
                            : {
                                  translateY: 100,
                              }
                    }
                    transition={{
                        type: "timing",
                        duration: 200,
                    }}
                    style={styles.motiView}
                >
                    {showWalletSheet ? <WalletConnectionStatusBar /> : null}
                </MotiView>

                {sheet ? (
                    <DiscoverSearch
                        bottomSheetRef={bottomSheetRef}
                        webViewRef={webViewRef}
                    />
                ) : null}
                <MotiView
                    from={{ translateY: 100 }}
                    animate={{ translateY: 0 }}
                    style={{
                        width: theme.dimensions.fullWidth,
                        position: "relative",
                    }}
                    transition={{
                        type: "timing",
                        duration: 100,
                    }}
                >
                    <MainControlBar
                        webViewRef={webViewRef}
                        toggleCollapsible={toggleCollapsible}
                        toggleAddressBar={toggleAddressBar}
                        webViewNavigationEvent={webViewNavigationEvent}
                    />
                </MotiView>
            </YStack>
        </YStack>
    );
}
