import { FlashList } from "@shopify/flash-list";
import { Text, theme } from "../../../ui";
import { XStack, YStack } from "../../../ui/stack";
import { Image } from "expo-image";
import { RefreshControl, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import { useTokenBalancesState } from "../../../state/tokenBalanceState";
import { getTokenBalance } from "../../../helpers/wallet/api/getTokenBalance";
import { images } from "../../../config/constants/images";
import WalletZeroStart from "../WalletZeroStart";

const styles = StyleSheet.create({
    imageDp: {
        width: 40,
        height: 40,
        borderRadius: 20,
        position: "relative",
        backgroundColor: theme.colors.base_primary + 50,
    },
    imageBlockChain: {
        width: 25,
        height: 25,
        borderRadius: 12.5,
        position: "absolute",
        left: -5,
        bottom: -5,
        backgroundColor: theme.colors.base_primary + 50,
    },
});
export default function TokenBalances() {
    const [refreshing, setRefreshing] = useState(false);
    const tokenBalances = useTokenBalancesState();
    const [tokenBalancesData, setTokenBalancesData] = useState<any>([]);

    const extractTokenItems = () => {
        const extractedItems = tokenBalances?.tokenBalances?.chains?.flatMap(
            (chain) =>
                chain?.items.map((item) => ({
                    ...item,
                    chain_name: chain?.chain_name, // Add chain_name key to each item
                }))
        );

        const filteredItems = extractedItems.filter(
            (item) => parseFloat(item.balance) !== 0
        );
        setTokenBalancesData(filteredItems);
    };

    useEffect(() => {
        extractTokenItems();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        getTokenBalance().then((res) => {
            if (res) {
                setRefreshing(false);
            }
        });
    };

    return (
        <FlashList
            contentContainerStyle={{ paddingBottom: 100 }}
            data={tokenBalancesData}
            ItemSeparatorComponent={() => {
                return <View style={{ height: theme.spacing.$3 }} />;
            }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListHeaderComponent={() => {
                if (tokenBalancesData.length === 0) {
                    return (
                        <WalletZeroStart
                            showWalletZeroStartSheet={false}
                            setShowWalletZeroStartSheet={() => {}}
                        />
                    );
                } else {
                    return null; // Add a default return statement
                }
            }}
            renderItem={({ item, index }) => (
                <XStack
                    alignItems="center"
                    justifyContent="space-between"
                    width={theme.dimensions.fullWidth * 0.9}
                    style={{ marginLeft: theme.spacing.$3 }}
                >
                    <XStack
                        alignItems="center"
                        justifyContent="space-between"
                        width={"auto"}
                    >
                        <Image
                            style={styles.imageDp}
                            source={{
                                uri: (item as any)?.logo_urls?.token_logo_url,
                            }}
                            contentFit="cover"
                            transition={1000}
                            placeholder={images.icon}
                        />
                        <Image
                            style={styles.imageBlockChain}
                            source={{
                                uri: (item as any)?.logo_urls?.chain_logo_url,
                            }}
                            contentFit="cover"
                            transition={1000}
                            placeholder={images.icon}
                        />
                    </XStack>

                    <YStack
                        alignItems="flex-start"
                        justifyContent="flex-start"
                        width={theme.dimensions.fullWidth * 0.8}
                        style={{ marginLeft: theme.spacing.$2 }}
                    >
                        <XStack
                            alignItems="center"
                            justifyContent="space-between"
                            width={theme.dimensions.fullWidth * 0.8}
                        >
                            <XStack
                                alignItems="center"
                                justifyContent="center"
                                width={null}
                            >
                                <Text variant={"heading_small"} color={"light"}>
                                    {(item as any).contract_name}
                                </Text>
                                <Text
                                    variant={"body_small"}
                                    color={"light"}
                                    opacity={0.4}
                                >
                                    {(item as any)?.chain_name ===
                                        "eth-sepolia" && " (Sepolia)"}
                                </Text>
                            </XStack>
                            <Text variant={"heading_small"} color={"light"}>
                                {(item as any).pretty_balanceUsd}
                            </Text>
                        </XStack>
                        <Text
                            variant={"body_small"}
                            color={"light"}
                            opacity={0.4}
                        >
                            {(item as any).balance}{" "}
                            {(item as any)?.contract_ticker_symbol}
                        </Text>
                    </YStack>
                </XStack>
            )}
            estimatedItemSize={200}
        />
    );
}
