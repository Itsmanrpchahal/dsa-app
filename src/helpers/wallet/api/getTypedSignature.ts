import axios from "axios";
import { log } from "../../../config/logger";
import { WALLET_SERVICE_API_HOST } from "@env";
import { useUserState } from "../../../state/userState";

export async function getTypedSignature(message: Record<string, any>) {
    try {
        const response = await axios.post(
            `${WALLET_SERVICE_API_HOST}/evm-wallet/sign-typed-message`,
            {
                uniqueUserId: useUserState.getState().userDetails.uuid,
                message: {
                    domain: message?.domain,
                    types: message?.types,
                    value: message?.message || message?.value,
                },
            }
        );
        log.debug(
            "response from typed message sign api",
            JSON.stringify(response.data)
        );
        const result = response.data;
        const signature = result.signature.signature;

        log.debug("typed signed hash", result);

        return signature;
    } catch (error) {
        log.error(error);
        throw new Error("Failed to get typed sign for a the object");
    }
}
