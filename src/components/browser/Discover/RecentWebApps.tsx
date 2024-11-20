import { ScrollView, View } from "react-native";
import { theme } from "../../../ui";
import {
    RecentlyViewedAppDetails,
    useRecentlyViewedAppsState,
} from "../../../state/recentsViewedAppsState";
import WebAppThumbnail from "./thumbnails/WebAppThumbnail";
import { useMemo } from "react";

export default function RecentWebApps() {
    const recentApps = useRecentlyViewedAppsState.getState().recentlyViewedApps;

    if (!recentApps || recentApps.length === 0) {
        return null;
    }

    // Memoize renderItem function using useMemo
    const renderItem = useMemo(() => {
        return (item: RecentlyViewedAppDetails, index: any) => (
            <WebAppThumbnail
                key={index}
                appId={item.appId}
                name={item.name}
                appUrl={item.appUrl}
                images={item.images}
            />
        );
    }, [recentApps]); // Depend on recentApps

    const renderGrid = (trendingApps: any[]) => {
        const numberOfRows = Math.ceil(trendingApps.length / 3);
        return Array.from({ length: numberOfRows }).map((_, rowIndex) => {
            const itemsForRow = trendingApps.slice(
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
                    {itemsForRow.map(renderItem)}
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
            {renderGrid(recentApps)}
        </ScrollView>
    );
}
