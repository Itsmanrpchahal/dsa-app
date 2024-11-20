import { MEROKU_API_HOST } from "@env";
import axios from "axios";
import { log } from "../../../config/logger";

export const getAutoCompleteSearch = async (search: string) => {
    try {
        const response = await axios({
            method: "GET",
            url: `${MEROKU_API_HOST}/dapp/autocomplete?search=${search}`,
            headers: {
                Accept: "application/json",
            },
        });

        if (response.status === 200) {
            log.debug(
                "search apps fetched successfully",
                 response.data
            );
            return response.data;
        } else {
            log.error("error fetching search apps");
        }
    } catch (error) {
        log.error("error fetching search apps", error);
    }
}
