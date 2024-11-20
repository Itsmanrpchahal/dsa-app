import { WALLET_SERVICE_API_HOST } from "@env";
import { log } from "../../../config/logger";
import { DdLogs } from "@datadog/mobile-react-native";
import { useUserState } from "../../../state/userState";
import { useNftsState } from "../../../state/nftsState";

export async function getNfts() {
    const userUuid = useUserState.getState().userDetails.uuid;

    if (!userUuid || typeof userUuid !== "string") {
        log.error("Invalid UUID: Exiting getFeed function");
        return [];
    }
    
    try {
    const res = await fetch(
            `${WALLET_SERVICE_API_HOST}/user/get-nft?uniqueUserId=${userUuid}`
        );
        const response = await res.json();
        const chains = response.data;
        useNftsState.getState().setNfts(chains)
        return response;
    } catch (error) {
        log.error(
            "Error:",
            `${WALLET_SERVICE_API_HOST}/user/get-token-balance?uniqueId+${userUuid}`,
            error
        );
        DdLogs.error(
            "Error fetching nfts:",
            `${WALLET_SERVICE_API_HOST}/user/get-token-balance?uniqueId+${userUuid}`,
            String(error)
        );
        throw error;
    }
}
