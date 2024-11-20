import { API_HOST, PUBLIC_APP_NAME } from "@env";
import axios from "axios";
import { useUserState } from "../../../state/userState";
import * as Burnt from "burnt";
import { getUserDetails } from "../../user";
import { theme } from "../../../ui";
import { useHelpShowState } from "../../../state/helpShowState";
import { useHomeStackNavigation } from "../../../navigation/types";

export async function registerDailyUsageAction() {
    const uuid = useUserState.getState().userDetails.uuid;
    const requestUrl = `${API_HOST}/points/action/daily_login/${uuid}`;

    axios({
        method: "PUT",
        url: requestUrl,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
    })
        .then((response) => {
            if (response.status === 200) {
                console.log("daily usage action registered successfully");
                getUserDetails();

                // timeout is to ensure user details is fetched and all UI of points reflect new score
                setTimeout(() => {
                    if (
                        useHelpShowState.getState().helpShown
                            .dailyPointsHelpShown
                    ) {
                        Burnt.alert({
                            title: "Yay! you won daily points!",
                            preset: "custom",
                            message: "come back & use daily to earn more!",
                            duration: 3,
                            shouldDismissByTap: true,
                            icon: {
                                ios: {
                                    name: "checkmark",
                                    color: theme.colors.positive,
                                },
                            },
                        });
                    } else {
                        Burnt.alert({
                            title: "Yay! you won your first points!",
                            preset: "custom",
                            message: `In ${PUBLIC_APP_NAME}, points are currency that you can use to enhance your app experience and more. You can earn points by using the app daily, completing challenges, and more.`,
                            duration: 30,
                            shouldDismissByTap: true,
                            icon: {
                                ios: {
                                    name: "checkmark",
                                    color: theme.colors.positive,
                                },
                            },
                        });
                        useHelpShowState
                            .getState()
                            .toggleHelpShownKey("dailyPointsHelpShown");
                    }
                }, 1000);
            } else {
                console.log("error registering daily usage action");
                return false;
            }
        })
        .catch((error) => {
            console.log("error registering daily usage action", error);
            return false;
        });
}
