import { MEROKU_API_HOST, MEROKU_API_KEY } from "@env";
import { log } from "../../../config/logger";
import { DdLogs } from "@datadog/mobile-react-native";

export async function getAppDetails(id: string) {
    try {
        const res = await fetch(`${MEROKU_API_HOST}/dapp/search/${id}`, {
            headers: {
                apiKey: MEROKU_API_KEY || "",
            },
        });
        const response = await res.json();
        const apps = response.data;

        return apps;
    } catch (error) {
        log.error("Error:", `${MEROKU_API_HOST}/dapp/search/${id}`);
        DdLogs.error(
            "Error fetching app details:",
            `${MEROKU_API_HOST}/dapp/search/${id}`
        );
        throw error;
    }
}
