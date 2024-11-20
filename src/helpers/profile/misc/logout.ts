import { segmentClient } from "../../../config/segmentClient";
import { useAuthState } from "../../../state";
import { useActionsForPointsState } from "../../../state/actionsForPointsState";
import { useDailyUsageState } from "../../../state/dailyUsageState";
import { useFeedState } from "../../../state/feedState";
import { useUserState } from "../../../state/userState";

export async function logout() {
    try {
        console.log("log out called");
        useAuthState.getState().clearState();
        useUserState.getState().clearState();
        useFeedState.getState().clearState();
        useActionsForPointsState.getState().clearState();
        useDailyUsageState.getState().clearState();

        console.log("log out called", "states cleared");
        segmentClient.reset();

        console.log("log out called", "tracking reset cleared");

        return true;
    } catch (e) {
        // clear error
        console.log("error clearing storage on logout", e);
    }
}
