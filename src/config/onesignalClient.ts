import { ONESIGNAL_APP_ID, ONESIGNAL_APP_ID_DEV } from "@env";
import { LogLevel, OneSignal } from "react-native-onesignal";
import { useUserState } from "../state/userState";

export function initializeOneSignal() {
    const appId = __DEV__ ? ONESIGNAL_APP_ID_DEV : ONESIGNAL_APP_ID;

    // Remove this method to stop OneSignal Debugging
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);

    // OneSignal Initialization
    OneSignal.initialize(appId);

    // requestPermission will show the native iOS or Android notification permission prompt.
    // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
    OneSignal.Notifications.requestPermission(true);

    const uuidOfUser = useUserState.getState().userDetails.uuid;

    if (uuidOfUser) {
        OneSignal.login(uuidOfUser);
    }

    // Method for listening for notification clicks
    OneSignal.Notifications.addEventListener("click", (event) => {
        console.log("OneSignal: notification clicked:", event);
    });
}
