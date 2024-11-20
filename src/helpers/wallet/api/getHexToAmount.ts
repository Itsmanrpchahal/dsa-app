import { WALLET_SERVICE_API_HOST } from "@env";
import axios from "axios";
import { log } from "../../../config/logger";

export async function getHexToAmount(
    hexOfAmount: string,
    chainSlug: string,
    nativeToken: boolean
): Promise<string> {
    try {
        const response = await axios({
            method: "GET",
            url: `${WALLET_SERVICE_API_HOST}/evm-blockchain/hex-to-amount`,
            params: {
                hexValueOfAmount: hexOfAmount,
                chain: chainSlug,
                nativeToken: nativeToken,
            },
        });

        log.debug("response from hex to amount api", String(response));
        const result = response.data;

        return result;
    } catch (error) {
        log.error(error);
        throw new Error("Failed to get amount from hex");
    }
}
