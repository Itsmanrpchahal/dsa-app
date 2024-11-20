import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { images } from "../../../../config/constants/images";
import { log } from "../../../../config/logger";
import { getGasEstimate } from "../../../../helpers/wallet/api/getGasEstimate";
import { getHexToAmount } from "../../../../helpers/wallet/api/getHexToAmount";
import { truncateLargeString } from "../../../../helpers/wallet/misc/truncateLargeString";
import { useConnectedDappsState } from "../../../../state/connectedDappsState";
import { useCurrentTabState } from "../../../../state/currentTabState";
import { useSupportedChainsState } from "../../../../state/supportedChainsState";
import { useWalletActionState } from "../../../../state/walletActionState";
import { Text, TextButton, theme } from "../../../../ui";
import { XStack, YStack } from "../../../../ui/stack";
import { Image } from "expo-image";

const styles = StyleSheet.create({
    image: {
        width: 50,
        height: 50,
        marginBottom: theme.spacing.$3,
    },
    messsageText: {
        marginTop: theme.spacing.$2,
        marginBottom: theme.spacing.$4,
        width: theme.dimensions.fullWidth * 0.8,
    },
    hostName: {
        marginTop: theme.spacing.$6,
    },
    buttonsContainer: {
        marginTop: theme.spacing.$5,
        marginBottom: theme.spacing.$5,
    },
});

export const SendTransactionSheet = ({ onConnect }: { onConnect: any }) => {
    const currentTabState = useCurrentTabState();
    const walletStateData =
        useWalletActionState.getState().walletAction.walletData;

    const currentHostUrl =
        useCurrentTabState.getState().currentTab?.hostNameUrl;

    const currentChainId =
        useConnectedDappsState
            .getState()
            .connectedDapps.find((dapp) => dapp.dappHostUrl === currentHostUrl)
            ?.chainId ?? "0x1";

    const chainIdSlug =
        useSupportedChainsState
            .getState()
            .supportedChains.chains?.find(
                (chain) => chain.chainIdHex === currentChainId
            )?.slug ?? "ethereum";

    const [convertedValue, setConvertedValue] = useState<any>(null);
    const [gasEstimate, setGasEstimate] = useState<any>(null);

    useEffect(() => {
        const fetchGasEstimate = async () => {
            const gasEstimate = await getGasEstimate(
                walletStateData.transactionData,
                chainIdSlug
            );
            setGasEstimate(gasEstimate.humanReadableGasEstimate);
        };

        const fetchReadableAmountOfValue = async () => {
            const convertedValue = await getHexToAmount(
                walletStateData.transactionData?.value,
                chainIdSlug,
                true
            );
            setConvertedValue(convertedValue);
        };

        fetchGasEstimate();
        fetchReadableAmountOfValue();
    }, []);

    return (
        <YStack
            alignItems={"center"}
            justifyContent={"flex-start"}
            width={theme.dimensions.fullWidth * 0.9}
            gap={theme.spacing.$4}
        >
            <Image
                style={styles.image}
                source={images.rocketLogo}
                contentFit="contain"
            ></Image>

            <Text variant="heading_small" color="content_primary">
                {currentTabState.currentTab?.hostname}
            </Text>

            <XStack
                alignItems={"center"}
                justifyContent={"center"}
                width={"100%"}
                style={{ marginTop: theme.spacing.$6 }}
            >
                {/* <Image
                    style={{
                        height: 32,
                        width: 32,
                        marginRight: theme.spacing.$2,
                    }}
                    resizeMode="contain"
                    source={images.rocketLogo}
                ></Image> */}

                <Text variant="heading_large" color="content_primary">
                    {convertedValue?.amount ?? "loading"}
                </Text>
            </XStack>

            <YStack
                alignItems={"flex-start"}
                justifyContent={"flex-start"}
                width={"100%"}
                style={{ marginTop: theme.spacing.$6 }}
                gap={theme.spacing.$2}
            >
                <Text
                    variant="body_small"
                    color="content_primary"
                    opacity={0.5}
                >
                    to
                </Text>
                <Text variant="body_post_content_bold" color="content_primary">
                    {truncateLargeString(
                        walletStateData.transactionData?.to,
                        5,
                        5
                    )}
                </Text>
            </YStack>

            <XStack
                alignItems={"center"}
                justifyContent={"space-between"}
                width={theme.dimensions.fullWidth * 0.9}
            >
                <Text
                    variant="body_small"
                    color="content_primary"
                    opacity={0.5}
                >
                    value
                </Text>
                <YStack
                    alignItems={"flex-end"}
                    justifyContent={"flex-end"}
                    width={"auto"}
                >
                    <Text
                        variant="body_post_content_bold"
                        color="content_primary"
                    >
                        {convertedValue?.amount ?? "loading"}
                    </Text>
                    <Text variant="body_post_content_bold" color="color_cyan">
                        ${convertedValue?.amount ?? "loading"}
                    </Text>
                </YStack>
            </XStack>

            <XStack
                alignItems={"center"}
                justifyContent={"space-between"}
                width={theme.dimensions.fullWidth * 0.9}
            >
                <Text
                    variant="body_small"
                    color="content_primary"
                    opacity={0.5}
                >
                    gas estimated
                </Text>
                <YStack
                    alignItems={"flex-end"}
                    justifyContent={"flex-end"}
                    width={"auto"}
                >
                    <Text
                        variant="body_post_content_bold"
                        color="content_primary"
                    >
                        {gasEstimate ? gasEstimate?.substring(0, 3) : "loading"}
                    </Text>
                </YStack>
            </XStack>

            <XStack
                alignItems={"center"}
                justifyContent={"space-between"}
                width={theme.dimensions.fullWidth * 0.9}
            >
                <Text
                    variant="body_small"
                    color="content_primary"
                    opacity={0.5}
                >
                    total
                </Text>
                <YStack
                    alignItems={"flex-end"}
                    justifyContent={"flex-end"}
                    width={"auto"}
                >
                    <Text
                        variant="body_post_content_bold"
                        color="content_primary"
                    >
                        {convertedValue?.amount ?? "loading"}
                    </Text>
                </YStack>
            </XStack>

            <XStack
                alignItems={"center"}
                justifyContent={"space-around"}
                width={"100%"}
                style={styles.buttonsContainer}
            >
                <TextButton
                    trackingName="Send Transaction Cancelled In Send Transaction Sheet"
                    trackingParameters={{
                        hostname: currentTabState.currentTab?.hostname,
                    }}
                    widthOfButton={theme.dimensions.fullWidth * 0.4}
                    onPress={() => {
                        walletStateData.onNegativePress();
                    }}
                    label={"Cancel"}
                    buttonColor={theme.colors.off_light}
                    labelColor={theme.colors.dark}
                />
                <TextButton
                    trackingName="Send Transaction Confirmed In Send Transaction Sheet"
                    trackingParameters={{
                        hostname: currentTabState.currentTab?.hostname,
                    }}
                    widthOfButton={theme.dimensions.fullWidth * 0.4}
                    onPress={() => {
                        walletStateData.onPositivePress();
                    }}
                    label={"Confirm"}
                    buttonColor={theme.colors.brand_green_primary}
                    labelColor={theme.colors.dark}
                />
            </XStack>
        </YStack>
    );
};
