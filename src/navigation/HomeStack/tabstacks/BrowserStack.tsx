import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BrowserScreen from "../../../screens/BrowserScreen";
import { BrowserStackParamList } from "../../types";

const Stack = createNativeStackNavigator<BrowserStackParamList>();

export default function BrowserStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Browser" component={BrowserScreen} />
        </Stack.Navigator>
    );
}
