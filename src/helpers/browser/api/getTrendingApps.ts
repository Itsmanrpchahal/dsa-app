import { API_HOST } from "@env";
import axios from "axios";
import { useTrendingAppsState } from "../../../state/trendingAppsState";
import { log } from "../../../config/logger";

export async function getTrendingApps() {
    const trendingAppsState = useTrendingAppsState.getState();

    axios({
        method: "GET",
        url: `${API_HOST}/generate_content_meta/trendingApps`,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
    })
        .then((response) => {
            if (response.status === 200) {
                log.debug("trending apps fetched successfully");

                trendingAppsState.setTrendingApps(response.data);
            } else {
                log.error("error fetching trending apps");
                return false;
            }
        })
        .catch((error) => {
            log.error("error fetching trending apps", error);
            return false;
        });
}
