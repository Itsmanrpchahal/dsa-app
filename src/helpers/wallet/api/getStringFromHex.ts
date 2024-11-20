import axios from "axios";
import { log } from "../../../config/logger";
import { WALLET_SERVICE_API_HOST } from "@env";

export async function getStringFromHex(hex: string): Promise<string> {
    try {
        const response = await axios.get(
            `${WALLET_SERVICE_API_HOST}/evm-blockchain/hex-to-string?hex=${hex}`
        );

        const data = await response.data;

        return data.result;
    } catch (error) {
        log.error("error converting hex to string", error);
        throw new Error("Failed to convert hex to string");
    }
}
