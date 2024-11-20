import "react-native-gesture-handler";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import "text-encoding-polyfill";
import { decode } from "base-64";
global.atob = decode;

const originalWarn = console.warn;

import { AUTH0_CLIENT_ID, AUTH0_CUSTOM_DOMAIN, AUTH0_DOMAIN } from "@env";
import { PTMono_400Regular } from "@expo-google-fonts/pt-mono";
import { PortalProvider } from "@gorhom/portal";
import { ThemeProvider } from "@shopify/restyle";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect } from "react";
import { View } from "react-native";
import { Auth0Provider } from "react-native-auth0";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { datadogClient } from "./src/config/datadogClient";
import RootStack from "./src/navigation/RootStack";
import { theme } from "./src/ui";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function App() {
    let [fontsLoaded] = useFonts({
        PTMono_400Regular,
    });

    useEffect(() => {
        if (!__DEV__) {
            datadogClient().catch(console.error);
        }
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <Auth0Provider domain={AUTH0_CUSTOM_DOMAIN} clientId={AUTH0_CLIENT_ID}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <ThemeProvider theme={theme}>
                    <PortalProvider>
                        <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
                            <StatusBar style="light"  backgroundColor={theme.colors.dark}/>
                            <RootStack />
                        </View>
                    </PortalProvider>
                </ThemeProvider>
            </GestureHandlerRootView>
        </Auth0Provider>
    );
}

export default App;
