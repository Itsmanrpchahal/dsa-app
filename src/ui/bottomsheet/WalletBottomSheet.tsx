import React, { useEffect } from "react";
import {
    View,
    StyleSheet,
    StyleProp,
    ViewStyle,
    ModalProps,
    ScrollViewProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../theme/theme";
import { BlurView } from "expo-blur";
import { Clickable } from "../clickable";
import { segmentClient } from "../../config/segmentClient";
import ReactNativeModal from "react-native-modal";

export interface BottomSheetProps {
    trackingName: string;
    containerStyle?: StyleProp<ViewStyle>;
    modalProps?: ModalProps;
    onBackdropPress?(): void;
    isVisible?: boolean;
    scrollViewProps?: ScrollViewProps;
    children: React.ReactNode;
    backdropColor: string;
}

export function WalletBottomSheet({
    trackingName,
    containerStyle,
    onBackdropPress = () => null,
    isVisible = false,
    modalProps = {},
    children,
    scrollViewProps = {},
    backdropColor = theme.colors.base_primary + 70,
    ...rest
}: BottomSheetProps) {
    // analytics
    useEffect(() => {
        isVisible &&
            segmentClient.track("Bottom Sheet Opened", {
                name: trackingName,
            });
    }, [isVisible]);
    return (
        <ReactNativeModal
            isVisible={isVisible}
            swipeDirection={["down"]}
            propagateSwipe={true}
            swipeThreshold={100}
            onBackdropPress={onBackdropPress}
            onSwipeComplete={onBackdropPress}
            style={{ justifyContent: "flex-end", margin: 0 }}
            backdropColor={backdropColor}
        >
            <SafeAreaView>
                <BlurView intensity={75} tint="dark" style={styles.blurView}>
                    <View
                        style={{
                            width: theme.dimensions.fullWidth,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Clickable onPress={onBackdropPress} trackingName="">
                            <View
                                style={[
                                    styles.line,
                                    {
                                        backgroundColor:
                                            theme.colors.base_tertiary,
                                    },
                                ]}
                            />
                        </Clickable>
                        {children}
                    </View>
                </BlurView>
            </SafeAreaView>
        </ReactNativeModal>
    );
}

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        flexDirection: "column-reverse",
    },
    blurView: {
        width: theme.dimensions.fullWidth,
        backgroundColor: theme.colors.base_primary + 50,
        borderRadius: 25,
        alignItems: "center",
        paddingBottom: theme.spacing.$7,
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
    line: {
        width: 75,
        height: 4,
        backgroundColor: "grey",
        alignSelf: "center",
        marginVertical: 15,
        borderRadius: 2,
    },
});
