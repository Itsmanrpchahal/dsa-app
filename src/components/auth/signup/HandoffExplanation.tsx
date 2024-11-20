import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from "react-native-reanimated";
import { Text, TextButton, theme } from "../../../ui";
import { XStack, YStack } from "../../../ui/stack";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import * as Haptics from "expo-haptics";
import { useAuthState } from "../../../state";
import { useUserState } from "../../../state/userState";
import { fetchOnLanch } from "../../../helpers/general";

const styles = StyleSheet.create({
    parent: {
        flex: 1,
    },
    body: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    authExplainCopyContainer: {
        flexWrap: "wrap",
    },
    buttonContainer: {
        marginVertical: theme.spacing.$8,
    },
});

export default function HandoffExplanation() {
    const authExplainCopy = `explore latest of web3 and AI and earn  points every day!`;
    const durationPerLetter = 100;
    const buttonDelay = authExplainCopy.length * durationPerLetter;

    const opacityValues = authExplainCopy
        .split(" ")
        .map(() => useSharedValue(0));
    const buttonOpacity = useSharedValue(0);

    useEffect(() => {
        if (useUserState.getState().userDetails.uuid) {
            fetchOnLanch();
        } else {
            useAuthState.getState().setAuthDetails({
                name: "",
                loggedIn: false,
                onboardingState: null,
            });
        }
        opacityValues.forEach((opacity, index) => {
            opacity.value = withDelay(
                index * durationPerLetter,
                withTiming(1, { duration: durationPerLetter })
            );
        });

        setTimeout(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            buttonOpacity.value = withDelay(
                0,
                withTiming(1, { duration: 500 })
            );
        }, buttonDelay);
    }, []);

    const handleFinishOnboarding = () => {
        useAuthState.getState().setAuthDetails({
            name: useUserState.getState().userDetails.name ?? "",
            loggedIn: true,
            onboardingState: "finished",
        });
    };

    return (
        <YStack
            justifyContent={"space-between"}
            alignItems={"center"}
            width={null}
            style={styles.parent}
        >
            <View style={styles.body}>
                <XStack
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={theme.dimensions.fullWidth * 0.9}
                    style={styles.authExplainCopyContainer}
                >
                    {authExplainCopy.split(" ").map((letter, index) => {
                        const authExplainCopyStyle = useAnimatedStyle(() => {
                            return {
                                opacity: opacityValues[index].value,
                            };
                        });

                        return (
                            <Text
                                key={index}
                                variant="body_large"
                                color="content_1"
                                style={[authExplainCopyStyle]}
                            >
                                {letter + " "}
                            </Text>
                        );
                    })}
                </XStack>
            </View>
            <Animated.View
                style={{
                    ...styles.buttonContainer,
                    opacity: buttonOpacity,
                }}
            >
                <TextButton
                    onPress={() => handleFinishOnboarding()}
                    trackingName=""
                    label={"Start dAppStore"}
                    buttonColor={theme.colors.brand_green_primary}
                    labelColor={theme.colors.base_primary}
                />
            </Animated.View>
        </YStack>
    );
}
