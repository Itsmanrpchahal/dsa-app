import { ScrollView, View } from "react-native";
import {
    TrendingAppType,
    useTrendingAppsState,
} from "../../../state/trendingAppsState";
import { theme } from "../../../ui";
import TrendingThumbnail from "./thumbnails/TrendingThumbnail";
import { log } from "../../../config/logger";
import { useMemo } from "react";

// const trendingApps = [
//     {
//         appId: "zora.app",
//         hot: true,
//         airdrop: false,
//     },
//     {
//         appId: "uniswap.app",
//         hot: false,
//         airdrop: false,
//     },
//     {
//         appId: "sound-xyz.app",
//         hot: true,
//         airdrop: false,
//     },
//     {
//         appId: "highlight.app",
//         hot: true,
//         airdrop: false,
//     },
//     {
//         appId: "bungee.app",
//         hot: false,
//         airdrop: false,
//     },
// ];

export default function TrendingWebApps({ apps }: { apps: TrendingAppType[] }) {
    const trendingApps = useTrendingAppsState.getState().trendingApps;

    if (!trendingApps || trendingApps.length === 0) {
        return null;
    }

    log.debug("TrendingWebApps", trendingApps.length, trendingApps[0]);

    // Memoize renderItem function using useMemo
    const renderItem = useMemo(() => {
        return (item: TrendingAppType, index: any) => (
            <TrendingThumbnail appId={item.appId} hot={item.hot} key={index} />
        );
    }, [trendingApps]); // Depend on trendingApps

    const renderGrid = (trendingApps: TrendingAppType[]) => {
        const onlyTenApps = trendingApps.slice(0, 10);
        const numberOfRows = Math.ceil(onlyTenApps.length / 3);
        return Array.from({ length: numberOfRows }).map((_, rowIndex) => {
            const itemsForRow = onlyTenApps.slice(
                rowIndex * 3,
                rowIndex * 3 + 3
            );
            return (
                <View
                    key={rowIndex}
                    style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        marginBottom: theme.spacing.$2,
                        marginTop: theme.spacing.$2,
                        width: theme.dimensions.fullWidth * 0.9,
                        maxHeight: 70,
                    }}
                >
                    {itemsForRow.map((item, itemIndex) =>
                        renderItem(item, itemIndex)
                    )}
                </View>
            );
        });
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                flexDirection: "column",
                rowGap: theme.spacing.$5,
                paddingBottom: 50,
            }}
        >
            {renderGrid(apps && apps.length > 0 ? apps : trendingApps)}
        </ScrollView>
    );
}
