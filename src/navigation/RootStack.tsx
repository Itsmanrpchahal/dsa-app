import { NavigationContainer, Route } from "@react-navigation/native";
import { useAuthState } from "../state";
import AuthStack from "./AuthStack";
import HomeStack from "./HomeStack";
import * as Linking from "expo-linking";
import {
    DdRumReactNavigationTracking,
    ViewNamePredicate,
} from "@datadog/mobile-react-navigation";
import React from "react";
import { theme } from "../ui";

const viewNamePredicate: ViewNamePredicate = function customViewNamePredicate(
    route: Route<string, any | undefined>,
    trackedName: string
) {
    return trackedName;
};

export default function RootStack() {
    const authState = useAuthState();

    const prefix = Linking.createURL("/");

    const linking = {
        prefixes: [prefix],
        config: {
            screens: {
                Home: "home",
                Profile: "profile",
                Landing: "landing",
                Onboarding: "onboarding",
                Chatbot: "chatbot",
                ViewPostScreen: "viewpostscreen",
            },
        },
    };

    const navigationRef = React.useRef(null);

    return (
        <NavigationContainer
            theme={{ colors: { background: theme.colors.dark } }}
            linking={linking}
            ref={navigationRef}
            onReady={() => {
                DdRumReactNavigationTracking.startTrackingViews(
                    navigationRef.current,
                    viewNamePredicate
                );
            }}
        >
            {authState.authDetails.loggedIn ? <HomeStack /> : <AuthStack />}
        </NavigationContainer>
    );
}
