import { API_HOST } from "@env";
import axios from "axios";
import { useActionsForPointsState } from "../../../state/actionsForPointsState";

export async function getActionsForPoints() {
    const actionsForPointsState = useActionsForPointsState.getState();
    const requestUrl = `${API_HOST}/points/get_actions`;

    axios({
        method: "GET",
        url: requestUrl,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
    })
        .then((response) => {
            if (response.status === 200) {
                console.log("actions for points fetched successfully");

                actionsForPointsState.setActionsForPoints({
                    actionsList: response.data.data,
                });
            } else {
                console.log("error fetching actions for points");
                return false;
            }
        })
        .catch((error) => {
            console.log("error fetching actions for points", error);
            return false;
        });
}
