import { API_HOST } from "@env";
import axios from "axios";
import { useUserState } from "../../../state/userState";
import { logout } from "../../profile/misc/logout";
import { segmentClient } from "../../../config/segmentClient";
import { log } from "../../../config/logger";

export async function getUserDetails() {
    const userState = useUserState.getState();
    const requestUrl = `${API_HOST}/user/get_details/${userState.userDetails.uuid}`;

    axios({
        method: "GET",
        url: requestUrl,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
    })
        .then((response) => {
            if (response.status === 200) {
                console.log("user details fetched successfully");
                // console.log(response.data.data);
                userState.setUserDetails(response.data.data);

                segmentClient.identify(response.data.data.uuid, {
                    name: response.data.data.name,
                });
            } else {
                throw new Error("error fetching user details");
            }
        })
        .catch((error) => {
            if (
                !userState.userDetails.uuid ||
                userState.userDetails.uuid.length <= 1
            ) {
                logout();
            }
            log.debug("error fetching user details", error);
            return false;
        });

    return true;
}
