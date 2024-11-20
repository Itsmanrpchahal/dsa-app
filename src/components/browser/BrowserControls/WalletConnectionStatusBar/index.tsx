import { StyleSheet, View } from "react-native";
import { svgIcons } from "../../../../config/constants/iconSvgs";
import { Text, theme } from "../../../../ui";
import SvgIcon from "../../../../ui/icon/SvgIcon";
import { XStack, YStack } from "../../../../ui/stack";
import { useHomeStackNavigation } from "../../../../navigation/types";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { useCurrentTabState } from "../../../../state/currentTabState";
import { useConnectedDappsState } from "../../../../state/connectedDappsState";
import { Clickable } from "../../../../ui/clickable";
import { BlurView } from "expo-blur";

export default function WalletConnectionStatusBar() {
    const styles = StyleSheet.create({
        buttonView: {
            backgroundColor: theme.colors.brand_green_tertiary + "15",
            height: theme.spacing.$8,
            width: theme.spacing.$8,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            margin: theme.spacing.$2,
        },
        labelView: {
            marginLeft: theme.spacing.$2,
            width: theme.dimensions.fullWidth * 0.4,
            position: "absolute",
            textAlign: "center",
        },
        vaultStatus: {
            width: theme.spacing.$4,
            height: theme.spacing.$4,
            borderRadius: theme.spacing.$2,
            marginTop: theme.spacing.$1,
        },
    });

    const navigation = useHomeStackNavigation();
    const currentTabState = useCurrentTabState();
    const connectedDapps = useConnectedDappsState().connectedDapps;
    const [valutStatus, setVaultStatus] = useState(false);

    useEffect(() => {
        if (currentTabState.currentTab) {
            const index = connectedDapps.findIndex(
                (dapp) =>
                    dapp.dappHostUrl === currentTabState.currentTab?.hostNameUrl
            );
            if (index !== -1) {
                setVaultStatus(connectedDapps[index].connected);
            } else {
                setVaultStatus(false);
            }
        }
    }, []);
    return (
        <BlurView
            intensity={50}
            tint="dark"
            blurReductionFactor={0.5}
            style={{
                paddingLeft: theme.spacing.$1,
                paddingRight: theme.spacing.$1,
                backgroundColor: theme.colors.base_primary + "50",
            }}
        >
            <XStack
                justifyContent={"center"}
                alignItems={"center"}
                width={theme.dimensions.fullWidth}
            >
                {/* <Clickable onPress={() => {}} trackingName="">
                    <View
                        style={[
                            styles.buttonView,
                            {
                                flexDirection: "row",
                                width: theme.dimensions.fullWidth * 0.4,
                                justifyContent: "space-between",
                                paddingLeft: theme.spacing.$3,
                            },
                        ]}
                    >
                        <Image
                            style={styles.vaultStatus}
                            source={
                                valutStatus
                                    ? images.vaultConnected
                                    : images.vaultNotConnected
                            }
                            contentFit="contain"
                        />

                        <Text
                            variant="body_small"
                            color={"light"}
                            textAlign={"center"}
                            style={{ width: theme.dimensions.fullWidth * 0.3 }}
                        >
                            {valutStatus ? "connected" : "not connected"}
                        </Text>
                    </View>
                </Clickable> */}

                <Clickable
                    trackingName="Open Wallet In Wallet Connection Status Bar Clicked"
                    onPress={() => {
                        navigation.navigate("WalletScreen");
                    }}
                >
                    <View
                        style={[
                            styles.buttonView,
                            {
                                flexDirection: "row",
                                width: theme.dimensions.fullWidth * 0.4,
                                justifyContent: "space-between",
                                paddingLeft: theme.spacing.$3,
                            },
                        ]}
                    >
                        <Text
                            variant="body_small"
                            color={"light"}
                            style={[styles.labelView, { marginLeft: 0 }]}
                        >
                            view vault
                        </Text>
                    </View>
                </Clickable>
            </XStack>
        </BlurView>
    );
}
