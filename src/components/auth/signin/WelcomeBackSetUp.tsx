import AnimatedLottieView from "lottie-react-native";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { segmentClient } from "../../../config/segmentClient";
import { fetchOnLanch } from "../../../helpers/general";
import { useAuthState } from "../../../state";
import { useUserState } from "../../../state/userState";
import { Text, theme } from "../../../ui";
import { YStack } from "../../../ui/stack";
import { images } from "../../../config/constants/images";

const styles = StyleSheet.create({
    parent: {
        flex: 1,
    },
    body: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: theme.dimensions.fullWidth * 0.9,
    },
    authExplainCopyContainer: {
        textAlign: "center",
    },
    buttonContainer: {
        marginVertical: theme.spacing.$8,
    },
});

export default function WelcomeBackSetup() {
    const userDetails = useUserState().userDetails;

    useEffect(() => {
        if (userDetails.uuid) {
            fetchOnLanch();

            setTimeout(() => {
                // time delay until success message to shown
                segmentClient.track("Success", {
                    detail: "Sign In Welcome Back Page: sign in process finished",
                });

                useAuthState.getState().setAuthDetails({
                    name: userDetails.name ?? "",
                    loggedIn: true,
                    onboardingState: "finished",
                });
            }, 3000);
        } else {
            segmentClient.track("Error", {
                detail: "Sign In Welcome Back Page: uuid not found",
            });
            useAuthState.getState().setAuthDetails({
                name: "",
                loggedIn: false,
                onboardingState: null,
            });
        }
    }, []);

    return (
        <YStack
            justifyContent={"center"}
            alignItems={"center"}
            width={null}
            style={styles.parent}
        >
            <View style={styles.body}>
                <AnimatedLottieView
                    source={images.testTubeProcess}
                    autoPlay
                    loop
                    style={{ width: 200, height: 200 }}
                />
                <Text
                    variant="body_large"
                    color="content_1"
                    style={styles.authExplainCopyContainer}
                >
                    {`welcome back ${userDetails.name}. \n setting up the app for you!`}
                </Text>
            </View>
        </YStack>
    );
}
