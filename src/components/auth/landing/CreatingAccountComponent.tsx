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
export default function CreatingAccountComponent() {
    return (
        <YStack
            justifyContent={"center"}
            alignItems={"center"}
            width={null}
            style={styles.parent}
        >
            <View style={styles.body}>
                <AnimatedLottieView
                    source={images.processing}
                    autoPlay
                    loop
                    style={{ width: 200, height: 200 }}
                />
                <Text
                    variant="body_large"
                    color="content_1"
                    style={styles.authExplainCopyContainer}
                >
                    {`Verification Successful! \n Setting up your account...`}
                </Text>
            </View>
        </YStack>
    );
}
