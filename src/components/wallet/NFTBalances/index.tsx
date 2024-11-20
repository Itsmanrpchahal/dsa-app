import { useEffect, useState } from "react";
import { images } from "../../../config/constants/images";
import { CollapsibleView } from "../../../ui/collapsible";
import { YStack } from "../../../ui/stack";
import { theme } from "../../../ui";
import { RefreshControl, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { FlashList } from "@shopify/flash-list";
import { useNftsState } from "../../../state/nftsState";
import { getNfts } from "../../../helpers/wallet/api/getNfts";

const styles = StyleSheet.create({
    imageDp: {
        width: theme.spacing.$8,
        height: theme.spacing.$8,
        borderRadius: theme.spacing.$4,
        position: "relative",
    },
    collapsedImage: {
        width: 170,
        height: 170,
        borderRadius: theme.spacing.$4,
        marginTop: theme.spacing.$3,
    },
    imageView: {
        marginLeft: theme.spacing.$1,
    },
});

export default function NFTBalances() {
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const nfts = useNftsState();
    const [nftData, setNftData] = useState<any>([]);

    const extractTokenItems = () => {
        const extractedItems = nfts?.nfts?.chains?.flatMap(
            (chain) => chain?.items
        );
        setNftData(extractedItems);
    };

    useEffect(() => {
        extractTokenItems();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);

        getNfts().then((res) => {
            if (res) {
                setRefreshing(false);
            }
        });
    };

    return (
        <FlashList
            data={nftData}
            contentContainerStyle={{ paddingBottom: 100 }}
            estimatedItemSize={50}
            ItemSeparatorComponent={() => {
                return <View style={{ height: theme.spacing.$3 }} />;
            }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item, index }) => (
                <CollapsibleView headerTitle={(item as any).contract_name}>
                    <YStack
                        justifyContent="center"
                        alignItems="flex-start"
                        width={null}
                        gap={theme.spacing.$2}
                        style={{
                            marginLeft: theme.spacing.$2,
                        }}
                    >
                        {(item as any).nft_data.map(
                            (item: any, index: number) => {
                                return (
                                    <Image
                                        key={index}
                                        source={{
                                            uri: item.media.image_256,
                                        }}
                                        style={styles.collapsedImage}
                                        placeholder={images.icon}
                                    />
                                );
                            }
                        )}
                    </YStack>
                </CollapsibleView>
            )}
        />
    );
}
