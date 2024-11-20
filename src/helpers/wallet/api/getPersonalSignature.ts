import axios from "axios";
import { mockWallet } from "../injection/mockWallet";
import { log } from "../../../config/logger";
import { WALLET_SERVICE_API_HOST } from "@env";
import { useUserState } from "../../../state/userState";

export async function getPersonalSignature(message: string) {
    try {
        const response = await axios.post(
            `${WALLET_SERVICE_API_HOST}/evm-wallet/sign-message`,
            {
                uniqueUserId: useUserState.getState().userDetails.uuid,
                message: message,
            }
        );
        log.debug("response from personal sign api", JSON.stringify(response.data));
        const result = response.data;
        const signature = result.signature.signature;

        log.debug("signed hash", signature);
        

        return signature;
    } catch (error) {
        log.error(error);
        throw new Error("Failed to get sign for a message");
    }
}
