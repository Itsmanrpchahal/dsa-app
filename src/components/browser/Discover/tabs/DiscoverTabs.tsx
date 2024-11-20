import React, { useEffect, useMemo, useState } from "react";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { Text, theme } from "../../../../ui";
import TrendingWebApps from "../TrendingWebApps";
import RecentWebApps from "../RecentWebApps";
import { useRecentlyViewedAppsState } from "../../../../state/recentsViewedAppsState";
import { useTrendingPlaylistsState } from "../../../../state/trendingAppsPlaylist";

export default function DiscoverTabs() {
    const recentApps = useRecentlyViewedAppsState.getState().recentlyViewedApps;
    const trendingPlaylistsState = useTrendingPlaylistsState.getState();
    const TrendingRoute = () => <TrendingWebApps apps={[]} />;
    const RecentsRoute = () => <RecentWebApps />;

    const [index, setIndex] = useState(0);
    const [routes, setRoutes] = useState([
        { key: "trending", title: "Trending" },
    ]);

    useEffect(() => {
        recentApps &&
            recentApps.length > 0 &&
            setRoutes((prevRoutes) => {
                const filteredRoutes = prevRoutes.filter(
                    (route) =>
                        route.key === "trending" || route.key === "recents"
                );
                return [
                    ...filteredRoutes,
                    { key: "recents", title: "Recents" },
                ];
            });
    }, []);

    // Get playlistName from trendingPlaylistsState and add it to routes
    // useEffect(() => {
    //     if (trendingPlaylistsState.playlists) {
    //         const newRoutes = trendingPlaylistsState.playlists.map(
    //             (playlist) => ({
    //                 key: playlist.playlistName.toLowerCase(),
    //                 title: playlist.playlistName,
    //             })
    //         );

    //         setRoutes((prevRoutes) => {
    //             // Clear previous routes and add the new ones
    //             const filteredRoutes = prevRoutes.filter(
    //                 (route) =>
    //                     route.key === "trending" || route.key === "recents"
    //             );
    //             return [...filteredRoutes, ...newRoutes];
    //         });
    //     }
    // }, [trendingPlaylistsState.playlists]);

    // Update renderScene to include the new route
    const renderScene = useMemo(() => {
        const sceneMap: { [key: string]: React.ComponentType<any> } = {};

        routes.forEach((route) => {
            if (route.key === "trending") {
                sceneMap.trending = () => <TrendingRoute />;
            } else if (route.key === "recents") {
                sceneMap.recents = () => <RecentsRoute />;
            } else {
                // Dynamically add other routes with playlist data
                const playlist = trendingPlaylistsState?.playlists?.find(
                    (playlist) =>
                        playlist.playlistName.toLowerCase() === route.key
                );
                sceneMap[route.key] = () => (
                    <TrendingWebApps apps={playlist ? playlist.apps : []} />
                );
            }
        });

        return SceneMap(sceneMap);
    }, [routes, trendingPlaylistsState.playlists]);

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={{ backgroundColor: theme.colors.transparent }}
            style={{
                backgroundColor: theme.colors.transparent,
                width: theme.dimensions.fullWidth,
            }}
            tabStyle={{ width: "auto", marginLeft: theme.spacing.$5 }}
            renderLabel={({ route, focused, color }) => (
                <Text
                    variant="body_post_content_bold"
                    color={focused ? "content_primary" : "content_primary"}
                    opacity={focused ? 1 : 0.5}
                >
                    {route.title}
                </Text>
            )}
        />
    );
    return (
        <TabView
            renderTabBar={renderTabBar}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: theme.dimensions.fullWidth }}
            style={{ width: theme.dimensions.fullWidth }}
        />
    );
}
