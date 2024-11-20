import AnimatedLottieView from "lottie-react-native";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useLandingStackNavigation } from "../../../navigation/types";
import { useAuthState } from "../../../state";
import { Text, theme } from "../../../ui";
import { YStack } from "../../../ui/stack";
import { segmentClient } from "../../../config/segmentClient";
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

type CreatingAccountSuccessProps = {
    newUser: boolean | null;
};

export default function CreatingAccountSuccess({
    newUser,
}: CreatingAccountSuccessProps) {
    const navigation = useLandingStackNavigation();

    useEffect(() => {
        if (newUser == null) {
            // new user is null, means user data/state corrupted
            navigation.navigate("Landing");
            segmentClient.track("Error", {
                detail: "CreatingAccountSuccess Page: new user detail is null",
            });
        }

        setTimeout(() => {
            // time delay until success message to shown
            segmentClient.track("Success", {
                detail: "CreatingAccountSuccess Page: sign up process finished",
            });

            useAuthState.getState().setAuthDetails({
                name: "",
                loggedIn: false,
                onboardingState: newUser ? "signUpProcess" : "signInProcess",
            });
        }, 3000);
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
                    source={images.success}
                    autoPlay
                    loop
                    style={{ width: 200, height: 200 }}
                />
                <Text
                    variant="body_large"
                    color="content_1"
                    style={styles.authExplainCopyContainer}
                >
                    {`your account is ready!`}
                </Text>
            </View>
        </YStack>
    );
}
