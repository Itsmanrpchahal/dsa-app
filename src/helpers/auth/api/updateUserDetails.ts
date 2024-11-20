import { API_HOST } from "@env";
import axios from "axios";
import { segmentClient } from "../../../config/segmentClient";
import { useUserState } from "../../../state/userState";

type UpdateUserDetailsApiResponse = {
    success: boolean;
    error: string | null;
};

// currently only name can be updated by the user explicitly
export async function updateUserDetails(
    name: string
): Promise<UpdateUserDetailsApiResponse> {
    const requestUrl = `${API_HOST}/user/update_user`;
    const userState = useUserState.getState();

    try {
        const response = await axios({
            method: "PUT",
            url: requestUrl,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            data: {
                uuid: userState.userDetails.uuid,
                user_name: name,
            },
        });

        const updatedUserDetaild = response.data.data;

        useUserState.getState().setUserDetails(updatedUserDetaild);

        segmentClient.track("User updated details");

        return {
            success: true,
            error: null,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response.data.error,
        };
    }
}
