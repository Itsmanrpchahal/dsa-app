import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignInFlow from "../../screens/auth/SignInFlow";

export default function SignInStack() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="SignInFlow" component={SignInFlow} />
        </Stack.Navigator>
    );
}
