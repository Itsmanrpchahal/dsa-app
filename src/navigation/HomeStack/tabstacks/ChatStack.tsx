import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatbotScreen from "../../../screens/Chatbot";
import { ChatStackParamList } from "../../types";

const Stack = createNativeStackNavigator<ChatStackParamList>();

export default function ChatStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Chatbot" component={ChatbotScreen} />
        </Stack.Navigator>
    );
}
