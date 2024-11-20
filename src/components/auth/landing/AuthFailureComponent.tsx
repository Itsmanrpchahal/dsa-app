import { StyleSheet, View } from "react-native";
import { Text, TextButton, theme } from "../../../ui";
import { YStack } from "../../../ui/stack";
import AnimatedLottieView from "lottie-react-native";
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

type AuthFailureComponentProps = {
    handleAuthFunction: () => void;
};

export default function AuthFailureComponent({
    handleAuthFunction,
}: AuthFailureComponentProps) {
    return (
        <YStack
            justifyContent={"space-between"}
            alignItems={"center"}
            width={null}
            style={styles.parent}
        >
            <YStack
                style={styles.body}
                justifyContent={"center"}
                alignItems={"center"}
                width={null}
            >
                <AnimatedLottieView
                    source={images.failed}
                    autoPlay
                    loop
                    style={{ width: 200, height: 200 }}
                />
                <Text
                    variant="body_large"
                    color="content_1"
                    style={styles.authExplainCopyContainer}
                >
                    Oops! Verification failed. Please try again to proceed.
                </Text>
            </YStack>
            <View style={styles.buttonContainer}>
                <TextButton
                    onPress={() => handleAuthFunction()}
                    label={"VERIFY EMAIL"}
                    trackingName="Verify Email Button Clicked in Auth Failure Screen"
                    buttonColor={theme.colors.color_1}
                    labelColor={theme.colors.content_1}
                />
            </View>
        </YStack>
    );
}
