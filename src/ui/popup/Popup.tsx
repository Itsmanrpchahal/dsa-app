import { BlurView } from "expo-blur";
import { Platform, StyleSheet, View } from "react-native";
import Modal from "react-native-modal";
import theme from "../theme/theme";

export interface PopupProps {
    children: React.ReactNode;
    isVisible: boolean;
    closePopup: () => void;
    height: "short" | "tall";
}

export default function Popup({
    children,
    isVisible,
    closePopup,
    height,
}: PopupProps) {
    const styles = StyleSheet.create({
        popup_card: {
            paddingHorizontal: theme.spacing.$4,
            height:
                height === "short"
                    ? theme.dimensions.fullHeight * 0.3
                    : theme.dimensions.fullHeight * 0.4,
            borderRadius: theme.spacing.$4,
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            backgroundColor: theme.colors.base_3,
        },
    });

    const PlatformSpecifcParent = (props: { children: React.ReactNode }) => {
        return (
            <>
                {Platform.OS === "ios" ? ( // Check the platform and conditionally render BlurView for iOS
                    <BlurView
                        intensity={75}
                        tint="dark"
                        style={styles.popup_card}
                        blurReductionFactor={50}
                    >
                        {props.children}
                    </BlurView>
                ) : (
                    // For Android or other platforms, render the children without BlurView
                    <View style={styles.popup_card}>{props.children}</View>
                )}
            </>
        );
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={() => {
                closePopup();
            }}
            onBackButtonPress={() => {
                closePopup();
            }}
        >
            <PlatformSpecifcParent>{children}</PlatformSpecifcParent>
        </Modal>
    );
}
