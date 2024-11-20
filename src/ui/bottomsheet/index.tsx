import {
    Dimensions,
    Keyboard,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    View,
} from "react-native";
import React, {
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState,
} from "react";
import { Portal } from "@gorhom/portal";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import theme from "../theme/theme";
import { runOnJS } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { segmentClient } from "../../config/segmentClient";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type BottomSheetProps = {
    trackingName: string;
    children: React.ReactNode;
    sheetBackdropHeight?: number;
    backdropOpacity?: number;
};

export type BottomSheetRefProps = {
    scrollTo: (destination: number) => void;
    isActive: () => boolean;
};

export const BottomSheet = React.forwardRef<
    BottomSheetRefProps,
    BottomSheetProps
>(({ trackingName, children, sheetBackdropHeight, backdropOpacity }, ref) => {
    const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + (sheetBackdropHeight ?? 0);
    const translateY = useSharedValue(0);
    const active = useSharedValue<boolean>(false);
    const [is_Open, setIs_Open] = useState<boolean>(false);
    const context = useSharedValue({ y: 0 });
    const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);

    const scrollTo = useCallback((destination: number) => {
        "worklet";
        active.value = destination !== 0;
        translateY.value = withTiming(destination, { duration: 200 });
    }, []);

    const isActive = useCallback(() => {
        return active.value;
    }, []);

    useImperativeHandle(ref, () => ({ scrollTo, isActive }), [
        scrollTo,
        isActive,
    ]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            "keyboardDidShow",
            () => {
                setIsKeyboardOpen(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            "keyboardDidHide",
            () => {
                setIsKeyboardOpen(false);
            }
        );
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    // analytics
    useEffect(() => {
        is_Open &&
            segmentClient.track("Bottom Sheet Opened", {
                name: trackingName,
            });
    }, [is_Open]);

    const myNonWorkletFunction = (value: boolean, translateY: any) => {
        if (translateY === 0 && value === false && is_Open) {
            setIs_Open(false);
            if (isKeyboardOpen) {
                Keyboard.dismiss();
            }
        } else if (translateY !== 0 || value === true) {
            setIs_Open(true);
        }
    };

    const panGesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translateY.value };
        })
        .onUpdate((event) => {
            translateY.value = event.translationY + context.value.y;
            translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
        })
        .onEnd(() => {
            if (translateY.value > -SCREEN_HEIGHT / 3) {
                scrollTo(0);
            } else if (translateY.value < -SCREEN_HEIGHT / 1.5) {
                scrollTo(MAX_TRANSLATE_Y + (sheetBackdropHeight ?? 0));
            }
        });

    const closeBottomSheet = () => {
        if (isActive()) {
            scrollTo(0);
        }
    };

    const rBottomSheetStyle = useAnimatedStyle(() => {
        const borderRadius = interpolate(
            translateY.value,
            [MAX_TRANSLATE_Y + (sheetBackdropHeight ?? 0), MAX_TRANSLATE_Y],
            [25, 5],
            Extrapolate.CLAMP
        );

        runOnJS(myNonWorkletFunction)(false, translateY.value);

        return {
            borderRadius,
            transform: [{ translateY: translateY.value }],
        };
    });

    return (
        <Portal>
            {translateY.value !== 0 && (
                <Pressable
                    style={[
                        styles.overlay,
                        { opacity: backdropOpacity ?? 0.7 },
                    ]}
                    onPress={closeBottomSheet}
                />
            )}
            <GestureDetector gesture={panGesture}>
                <Animated.View
                    style={[styles.bottomSheetContainer, rBottomSheetStyle]}
                >
                    <BlurView
                        intensity={Platform.OS === "ios" ? 75 : 100}
                        tint="dark"
                        style={styles.blurView}
                        blurReductionFactor={12}
                    >
                        <View
                            style={[
                                styles.line,
                                {
                                    backgroundColor: theme.colors.base_tertiary,
                                },
                            ]}
                        />
                        {children}
                    </BlurView>
                </Animated.View>
            </GestureDetector>
        </Portal>
    );
});

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        flexDirection: "column-reverse",
    },
    blurView: {
        width: theme.dimensions.fullWidth,
        height: "100%",
        backgroundColor: theme.colors.base_primary + 50,
        borderRadius: 25,
        alignItems: "center",
    },
    overlay: {
        flex: 1,
        position: "absolute",
        top: 0,
        height: "100%",
        width: theme.dimensions.fullWidth,
        backgroundColor: theme.colors.base_primary,
        opacity: 0.7,
    },
    bottomSheetContainer: {
        height: theme.dimensions.fullHeight,
        width: theme.dimensions.fullWidth,
        position: "absolute",
        top: Platform.OS === "ios" ? theme.dimensions.fullHeight : "100%",
        borderRadius: 25,
        alignItems: "center",
    },
    line: {
        width: 75,
        height: 4,
        backgroundColor: "grey",
        alignSelf: "center",
        marginVertical: 15,
        borderRadius: 2,
    },
});
