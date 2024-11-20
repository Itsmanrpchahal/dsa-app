import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { svgIcons } from "../../../../config/constants/iconSvgs";
import { useCurrentTabState } from "../../../../state/currentTabState";
import { Text, theme } from "../../../../ui";
import SvgIcon from "../../../../ui/icon/SvgIcon";
import { XStack } from "../../../../ui/stack";
import { useEffect, useState } from "react";
import { useHomeStackNavigation } from "../../../../navigation/types";
import { Clickable } from "../../../../ui/clickable";
import { BlurView } from "expo-blur";

interface DiscoverControlBarProps {
    webViewRef: React.RefObject<WebView>;
    setAddressBar: (value: boolean) => void;
}

const DiscoverControlBar = ({
    webViewRef,
    setAddressBar,
}: DiscoverControlBarProps) => {
    const styles = StyleSheet.create({
        buttonView: {
            backgroundColor: theme.colors.brand_green_tertiary + "15",
            height: theme.spacing.$8,
            width: theme.spacing.$8,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.spacing.$2,
        },
        labelView: {
            marginLeft: theme.spacing.$2,
            width: theme.dimensions.fullWidth * 0.4,
            position: "absolute",
            textAlign: "center",
        },
    });

    const texts = ["search dApps", "search AI tools", "search web3"];
    const [textIndex, setTextIndex] = useState(0);
    const navigation = useHomeStackNavigation();

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <BlurView
            intensity={50}
            tint="dark"
            style={{
                backgroundColor: theme.colors.base_primary + "50",
            }}
        >
            <XStack
                alignItems={"center"}
                justifyContent="space-evenly"
                width={theme.dimensions.fullWidth}
                style={{
                    paddingLeft: theme.spacing.$1,
                    paddingRight: theme.spacing.$1,
                    marginVertical: theme.spacing.$2,
                }}
            >
                <Clickable
                    trackingName="Search In Discover Control Bar Clicked"
                    onPress={() => {
                        setAddressBar(!setAddressBar);
                    }}
                >
                    <View
                        style={[
                            styles.buttonView,
                            {
                                flexDirection: "row",
                                width: theme.dimensions.fullWidth * 0.45,
                                justifyContent: "space-between",
                                paddingLeft: theme.spacing.$3,
                            },
                        ]}
                    >
                        <SvgIcon
                            svgOfIcon={svgIcons.searchIcon}
                            iconColor={theme.colors.content_1}
                            onPress={() => {
                                useCurrentTabState.getState().clearState();
                            }}
                            notClickable={true}
                            trackingName="" // empty because icon is not clickable
                        />

                        <Text
                            variant="body_small"
                            color={"light"}
                            style={{ width: theme.dimensions.fullWidth * 0.3 }}
                        >
                            {texts[textIndex]}
                        </Text>
                    </View>
                </Clickable>

                <Clickable
                    trackingName="Wallet In Discover Control Bar Clicked"
                    onPress={() => {
                        navigation.navigate("WalletScreen");
                    }}
                >
                    <View
                        style={[
                            styles.buttonView,
                            {
                                flexDirection: "row",
                                width: theme.dimensions.fullWidth * 0.45,
                                justifyContent: "space-between",
                                paddingLeft: theme.spacing.$3,
                            },
                        ]}
                    >
                        <SvgIcon
                            svgOfIcon={svgIcons.vault_Icon}
                            iconColor={theme.colors.content_1}
                            notClickable={true}
                            trackingName="" // empty because icon is not clickable
                        />
                        <Text
                            variant="body_small"
                            color={"light"}
                            style={styles.labelView}
                        >
                            vault
                        </Text>
                    </View>
                </Clickable>
            </XStack>
        </BlurView>
    );
};

export default DiscoverControlBar;
