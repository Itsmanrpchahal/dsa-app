import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../../screens/Home";
import { FeedStackParamList } from "../../types";

const Stack = createNativeStackNavigator<FeedStackParamList>();

export default function FeedStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
    );
}
