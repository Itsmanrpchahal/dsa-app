import { API_HOST } from "@env";
import axios from "axios";
import { useUserState } from "../../../state/userState";
import { useInviteCodesState } from "../../../state/inviteCodesState";

export async function fetchInviteCodes() {
    const userState = useUserState.getState();
    const inviteCodesState = useInviteCodesState.getState();

    axios({
        method: "GET",
        url: `${API_HOST}/invites/get_invites/${userState.userDetails.uuid}`,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
    })
        .then((response) => {
            if (response.status === 200) {
                console.log("invite codes fetched successfully");

                inviteCodesState.setInviteCodes({
                    inviteCodes: response.data.data,
                });
            } else {
                console.log("error fetching invite codes");
                return false;
            }
        })
        .catch((error) => {
            console.log("error fetching invite codes", error);
            return false;
        });
}
