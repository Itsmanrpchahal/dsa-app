import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import _ from "lodash";

export type AppType = {
    appId: string;
    hot: boolean;
    airdrop: boolean;
};

export type TrendingPlaylistType = {
    playlistName: string;
    apps: AppType[];
};

interface TrendingPlaylistsStateType {
    playlists: TrendingPlaylistType[] | null;
    setPlaylists: (playlists: TrendingPlaylistType[]) => void;
    addNewAppToPlaylist: (playlistIndex: number, app: AppType) => void;
    clearState: () => void;
}

export const useTrendingPlaylistsState = create<TrendingPlaylistsStateType>()(
    devtools(
        persist(
            (set) => ({
                playlists: null,
                setPlaylists: (playlists: TrendingPlaylistType[]) =>
                    set({ playlists }),
                addNewAppToPlaylist: (playlistIndex: number, app: AppType) =>
                    set((state) => {
                        if (state.playlists && state.playlists[playlistIndex]) {
                            const updatedPlaylists = _.cloneDeep(state.playlists);
                            updatedPlaylists[playlistIndex].apps.push(app);
                            return {
                                playlists: updatedPlaylists,
                            };
                        }
                        return state;
                    }),
                clearState: () =>
                    set({
                        playlists: null,
                    }),
            }),
            {
                name: "trending-playlists-storage",
                storage: createJSONStorage(() => AsyncStorage),
            }
        )
    )
);
