import { API_HOST } from "@env";
import axios from "axios";
import { segmentClient } from "../../../config/segmentClient";
import { useUserState } from "../../../state/userState";

type DirectUserSignUpResponse = {
    newUser: boolean | null;
    error: string | null;
};

export async function directUserSignUp(
    name: string,
    uuid: string,
    interests: string[],
    emailId: string
): Promise<DirectUserSignUpResponse> {
    const requestUrl = `${API_HOST}/user/signup`;
    const userState = useUserState.getState();

    try {
        const response = await axios({
            method: "POST",
            url: requestUrl,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            data: {
                user_name: name,
                uuid: uuid,
                interests: interests,
                phone_number: emailId,
            },
        });

        const newUserDetails = response.data.data;

        userState.setUserDetails(newUserDetails);

        // analytics
        segmentClient.identify(newUserDetails.uuid, {
            name: newUserDetails.name,
        });

        return { newUser: !newUserDetails.onboarding_finished, error: null };
    } catch (error: any) {
        console.log("error signing up api", error);
        return { newUser: null, error: String(error) };
    }
}
