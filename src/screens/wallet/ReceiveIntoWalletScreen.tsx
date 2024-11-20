import * as Burnt from "burnt";
import * as Clipboard from "expo-clipboard";
import { Share } from "react-native";
import { useUserState } from "../../state/userState";
import { Text, TextButton, theme } from "../../ui";
import { Clickable } from "../../ui/clickable";
import { ModalScreen } from "../../ui/screens";
import { XStack, YStack } from "../../ui/stack";
import QRCode from "react-native-qrcode-skia";
import {
    BlurMask,
    DashPathEffect,
    SweepGradient,
    vec,
} from "@shopify/react-native-skia";

export default function ReceiveIntoWalletScreen() {
    const publicEvmAddress =
        useUserState.getState().userDetails?.publicEvmAddress ?? "";

    const truncatedAddress = `${publicEvmAddress?.substring(
        0,
        10
    )}...${publicEvmAddress?.substring(publicEvmAddress?.length - 5)}`;

    return (
        <ModalScreen
            title="Receive"
            trackingName={"Receive Into Wallet Screen"}
        >
            <YStack
                justifyContent={"center"}
                alignItems={"center"}
                width={"100%"}
                gap={theme.spacing.$8}
                style={{ flex: 1 }}
            >
                <QRCode value={publicEvmAddress} size={200} strokeWidth={0.7}>
                    <SweepGradient
                        c={vec(100, 100)}
                        colors={[theme.colors.brand_green_primary]}
                    />
                    <BlurMask blur={1} style={"solid"} />
                    <DashPathEffect intervals={[3.5, 0.5]} />
                </QRCode>
                <Clickable
                    onPress={() => {
                        Clipboard.setStringAsync(publicEvmAddress);
                        Burnt.toast({
                            title: "copied code",
                            preset: "done",
                            message: "",
                        });
                    }}
                    trackingName="Copy Wallet Address from Receive Into Wallet"
                >
                    <Text variant="heading_small" color="content_primary">
                        {truncatedAddress}
                    </Text>
                </Clickable>
                <Text
                    variant="body_small"
                    color="content_primary"
                    style={{
                        width: theme.dimensions.fullWidth * 0.9,
                        textAlign: "center",
                        opacity: 0.5,
                    }}
                >
                    currently supports Ethereum mainnet, Polygon, Base, Zora,
                    Arbitrum and Sepolia Testnet
                </Text>
                <XStack
                    justifyContent={"space-evenly"}
                    alignItems={"center"}
                    width={"100%"}
                >
                    <TextButton
                        onPress={() => {
                            Clipboard.setStringAsync(publicEvmAddress);
                            Burnt.toast({
                                title: "copied code",
                                preset: "done",
                                message: "",
                            });
                        }}
                        trackingName={"Share Wallet Address Clicked"}
                        label={"Copy"}
                        buttonColor={theme.colors.base_tertiary + "80"}
                        labelColor={theme.colors.content_primary}
                        small={true}
                    />
                    <TextButton
                        onPress={() =>
                            Share.share({
                                message: publicEvmAddress,
                            })
                        }
                        trackingName={"Share Wallet Address Clicked"}
                        label={"Share"}
                        buttonColor={theme.colors.base_tertiary + "80"}
                        labelColor={theme.colors.content_primary}
                        small={true}
                    />
                </XStack>
            </YStack>
        </ModalScreen>
    );
}
