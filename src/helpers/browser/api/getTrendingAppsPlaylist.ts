import { API_HOST } from "@env";
import axios from "axios";
import { log } from "../../../config/logger";
import { useTrendingPlaylistsState } from "../../../state/trendingAppsPlaylist";

export async function getTrendingAppsPlaylist() {
    const trendingAppsPlaylistState = useTrendingPlaylistsState.getState();

    axios({
        method: "GET",
        url: `${API_HOST}/trendingApps/playlists`,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
    })
        .then((response) => {
            if (response.status === 200) {
                log.debug("trending apps playlist fetched successfully");
                trendingAppsPlaylistState.setPlaylists(response.data);
            } else {
                log.error("error fetching trending apps playlist");
                return false;
            }
        })
        .catch((error) => {
            log.error("error fetching trending apps playlist", error);
            return false;
        });
}
