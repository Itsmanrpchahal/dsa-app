import axios from "axios";
import { useUserState } from "../../../state/userState";
import { CHAT_API_KEY } from "@env";

export async function sendChatFeedback(chatId: number, rating: 1 | 0) {
    const userState = useUserState.getState();
    const requestUrl = `https://friday-api.dappstore.app/chat/rate?user=${userState.userDetails.uuid}&chat_id=${chatId}&rating=${rating}`;

    axios({
        method: "POST",
        url: requestUrl,
        headers: {
            "X-FRIDAY-KEY": CHAT_API_KEY,
            "Content-Type": "application/json; charset=utf-8",
        },
    })
        .then((response) => {
            if (response.status === 200) {
                console.log("chat rating sent successfully");

                return true;
            } else {
                console.log("error sending chat rating");
                return false;
            }
        })
        .catch((error) => {
            console.log("error sending chat rating", error);
            return false;
        });
}
