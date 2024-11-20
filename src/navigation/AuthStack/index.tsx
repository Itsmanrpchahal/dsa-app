import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthState } from "../../state";
import LandingStack from "./LandingStack";
import SignInStack from "./SignInStack";
import SignUpStack from "./SignUpStack";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    const authState = useAuthState();

    return (
        <NavigationContainer independent={true}>
            {authState.authDetails.onboardingState === "signInProcess" ? (
                <SignInStack />
            ) : authState.authDetails.onboardingState === "signUpProcess" ? (
                <SignUpStack />
            ) : (
                <LandingStack />
            )}
        </NavigationContainer>
    );
}
