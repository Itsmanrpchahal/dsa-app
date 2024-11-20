import { API_HOST } from "@env";
import axios from "axios";

export async function getOnePostDetails(postId: string): Promise<any> {
    const requestUrl = `${API_HOST}/generatepost/get_post_details/${postId}`;

    console.log("postid in api call", postId);

    try {
        const response = await axios({
            method: "GET",
            url: requestUrl,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
        });

        if (response.status === 200) {
            return response.data.data;
        } else {
            console.log("error fetching get one post details");
            return false;
        }
    } catch (error) {
        console.log("error fetching get one post details", error);
        return false;
    }
}
