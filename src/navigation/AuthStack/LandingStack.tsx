import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserIdVerifyFlow from "../../screens/auth/UserIdVerifyFlow";
import LandingScreen from "../../screens/auth/Landing";

export default function LandingStack() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen
                name="UserIdVerifyFlow"
                component={UserIdVerifyFlow}
            />
        </Stack.Navigator>
    );
}
