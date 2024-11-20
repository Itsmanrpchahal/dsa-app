import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpFlow from "../../screens/auth/SignUpFlow";

export default function SignUpStack() {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="SignUpFlow" component={SignUpFlow} />
        </Stack.Navigator>
    );
}
