import { API_HOST } from "@env";
import axios from "axios";
import { segmentClient } from "../../../config/segmentClient";
import { useUserState } from "../../../state/userState";

type AcceptInviteApiResponse = {
    success: boolean;
    error: string | null;
    invited_by: string | null;
};

export async function acceptInvite(
    inviteCode: string
): Promise<AcceptInviteApiResponse> {
    const requestUrl = `${API_HOST}/user/accept_invite`;
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
                invite_code: inviteCode,
            },
        });

        const updatedUserDetaild = response.data.data;
        const invitedBy = response.data.invited_by;

        useUserState.getState().setUserDetails(updatedUserDetaild);

        segmentClient.track("User accepted invite");

        return {
            success: true,
            error: null,
            invited_by: invitedBy,
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.response.data.error,
            invited_by: null,
        };
    }
}
