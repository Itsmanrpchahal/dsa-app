import { FlashList } from "@shopify/flash-list";
import { Text, theme } from "../../../ui";
import { RefreshControl, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { XStack } from "../../../ui/stack";
import { images } from "../../../config/constants/images";
import { useTransactionHistoryState } from "../../../state/transactionHistoryState";
import { Clickable } from "../../../ui/clickable";
import * as WebBrowser from "expo-web-browser";

const styles = StyleSheet.create({
    imageDp: {
        width: 40,
        height: 40,
        borderRadius: 20,
        position: "relative",
        marginRight: theme.spacing.$2,
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

export default function WalletActivity() {
    const [refreshing, setRefreshing] = useState(false);
    const transactionHistory = useTransactionHistoryState();
    const [transactionData, setTransactionData] = useState<any>([]);

    const extractTransactionItems = () => {
        const extractedItems =
            transactionHistory?.transactionHistory?.chains?.flatMap(
                (chain) => chain?.items
            );
        setTransactionData(extractedItems);
    };

    useEffect(() => {
        extractTransactionItems();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };

    return (
        <FlashList
            contentContainerStyle={{ paddingBottom: 100 }}
            data={transactionData}
            ItemSeparatorComponent={() => {
                return <View style={{ height: theme.spacing.$3 }} />;
            }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item, index }) => (
                <Clickable
                    trackingName="View Transaction Activity Item In External Explorer Clicked"
                    onPress={() => {
                        WebBrowser.openBrowserAsync(
                            (item as any)?.explorers[0]?.url || ""
                        );
                    }}
                >
                    <XStack
                        alignItems="center"
                        justifyContent="space-between"
                        width={theme.dimensions.fullWidth * 0.9}
                        style={{ marginLeft: theme.spacing.$3 }}
                    >
                        <XStack
                            alignItems="center"
                            justifyContent="center"
                            width={"auto"}
                        >
                            <Image
                                style={styles.imageDp}
                                source={{
                                    uri: (item as any).gas_metadata.logo_url,
                                }}
                                contentFit="cover"
                                transition={1000}
                                placeholder={images.icon}
                            />

                            <Text variant={"heading_small"} color={"light"}>
                                {
                                    (item as any).gas_metadata
                                        .contract_ticker_symbol
                                }
                            </Text>
                        </XStack>

                        <Text variant={"heading_small"} color={"light"}>
                            {(item as any).pretty_gas_quote}
                        </Text>
                    </XStack>
                </Clickable>
            )}
            estimatedItemSize={200}
        />
    );
}
