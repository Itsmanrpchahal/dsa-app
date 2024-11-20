import { View } from "moti";
import { Pressable, StyleSheet } from "react-native";
import { svgIcons } from "../../../../config/constants/iconSvgs";
import { Text, theme } from "../../../../ui";
import SvgIcon from "../../../../ui/icon/SvgIcon";
import { XStack } from "../../../../ui/stack";
import WebView from "react-native-webview";
import { Clickable } from "../../../../ui/clickable";
import { BlurView } from "expo-blur";

interface WebViewControlBarProps {
    webViewRef: React.RefObject<WebView>;
    toggleCollapsible: () => void;
    setAddressBar: (value: boolean) => void;
    useCurrentTabState: any;
    webViewNavigationEvent: any;
}

const WebViewControlBar = ({
    webViewRef,
    toggleCollapsible,
    setAddressBar,
    useCurrentTabState,
    webViewNavigationEvent,
}: WebViewControlBarProps) => {
    const styles = StyleSheet.create({
        buttonView: {
            backgroundColor: theme.colors.brand_green_tertiary + "15",
            height: theme.spacing.$8,
            width: theme.spacing.$8,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
        },
        labelView: {
            marginLeft: theme.spacing.$2,
            width: theme.dimensions.fullWidth * 0.4,
            position: "absolute",
            textAlign: "center",
        },
    });

    const currentTabState = useCurrentTabState();

    return (
        <BlurView
            intensity={50}
            tint="dark"
            blurReductionFactor={0.5}
            style={{
                backgroundColor: theme.colors.base_primary + "50",
                paddingVertical: theme.spacing.$2,
                paddingHorizontal: theme.spacing.$3,
            }}
        >
            <XStack
                justifyContent={"space-between"}
                alignItems={"center"}
                width={"100%"}
            >
                <XStack
                    alignItems={"center"}
                    justifyContent={"center"}
                    width={"auto"}
                >
                    <View style={styles.buttonView}>
                        <SvgIcon
                            svgOfIcon={svgIcons.goBack}
                            iconColor={
                                webViewNavigationEvent?.canGoBack
                                    ? theme.colors.content_1
                                    : theme.colors.content_1 + 50
                            }
                            size={30}
                            onPress={() => {
                                webViewRef.current?.goBack();
                            }}
                            trackingName="Back Button In Webview Control Bar Clicked"
                        />
                    </View>
                    <View
                        style={[
                            styles.buttonView,
                            { marginLeft: theme.spacing.$1 },
                        ]}
                    >
                        <SvgIcon
                            svgOfIcon={svgIcons.goForward}
                            iconColor={
                                webViewNavigationEvent?.canGoForward
                                    ? theme.colors.content_1
                                    : theme.colors.content_1 + 50
                            }
                            size={30}
                            onPress={() => {
                                webViewRef.current?.goForward();
                            }}
                            trackingName="Forward Button In Webview Control Bar Clicked"
                        />
                    </View>
                </XStack>

                <Clickable
                    trackingName="Search Bar In Webview Control Bar Clicked"
                    onPress={() => {
                        setAddressBar(true);
                    }}
                >
                    <View
                        style={[
                            styles.buttonView,
                            {
                                width: "auto",
                                maxWidth: theme.dimensions.fullWidth * 0.3,
                                paddingLeft: theme.spacing.$2,
                                paddingRight: theme.spacing.$2,
                            },
                        ]}
                    >
                        <Text
                            variant="body_small"
                            color={"content_1"}
                            numberOfLines={1}
                        >
                            {currentTabState.currentTab?.hostname ??
                                "enter webapp link"}
                        </Text>
                    </View>
                </Clickable>

                <XStack
                    alignItems={"center"}
                    justifyContent="center"
                    width={"auto"}
                >
                    <View style={styles.buttonView}>
                        <SvgIcon
                            svgOfIcon={svgIcons.vault_Icon}
                            iconColor={theme.colors.content_1}
                            onPress={() => {
                                toggleCollapsible();
                            }}
                            trackingName="Wallet Button In Webview Control Bar Clicked"
                        />
                    </View>
                    <View
                        style={[
                            styles.buttonView,
                            { marginLeft: theme.spacing.$1 },
                        ]}
                    >
                        <SvgIcon
                            svgOfIcon={svgIcons.homeIcon}
                            iconColor={theme.colors.content_1}
                            onPress={() => {
                                useCurrentTabState.getState().clearState();
                            }}
                            trackingName="Discover Home Button In Webview Control Bar Clicked"
                        />
                    </View>
                </XStack>
            </XStack>
        </BlurView>
    );
};

export default WebViewControlBar;
