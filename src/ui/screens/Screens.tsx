import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { useEffect } from "react";
import {
    ImageBackground,
    Platform,
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";
import { images } from "../../config/constants/images";
import { segmentClient } from "../../config/segmentClient";
import { Text } from "../text";
import theme from "../theme/theme";

export interface ScreenProps {
    children: React.ReactNode;
    trackingName: string;
    style?: StyleProp<ViewStyle>;
    title?: string;
}

interface BackgroundEffectProps {
    children: React.ReactNode;
    extraParentStyles: StyleProp<ViewStyle>;
}

function BackgroundEffect({
    children,
    extraParentStyles,
}: BackgroundEffectProps) {
    return (
        <ImageBackground
            source={images.backgroundGifSmall}
            style={{
                height: '100%',
                width: theme.dimensions.fullWidth,
                flex: 1,
                backgroundColor: theme.colors.base_primary,
            }}
        >
            <BlurView
                tint="dark"
                intensity={Platform.OS === "android" ? 100 : 50}
                blurReductionFactor={60}
                style={[
                    {
                        position: "absolute",
                        height: "100%",
                        width: theme.dimensions.fullWidth,
                    },
                    extraParentStyles,
                ]}
            >
                {children}
            </BlurView>
        </ImageBackground>
    );
}

export function PlainStackScreen({
    children,
    trackingName,
    style,
}: ScreenProps) {
    useEffect(() => {
        segmentClient.screen(trackingName);
    }, []);

    return (
        <BackgroundEffect extraParentStyles={style}>
            {children}
        </BackgroundEffect>
    );
}

export function TabStackScreen({ children, trackingName, style }: ScreenProps) {
    const tabBarHeight = useBottomTabBarHeight();

    useEffect(() => {
        segmentClient.screen(trackingName);
    }, []);

    return (
        <BackgroundEffect
            extraParentStyles={[
                {
                    paddingBottom: tabBarHeight,
                },
                style,
            ]}
        >
            {children}
        </BackgroundEffect>
    );
}

export function ModalScreen({
    children,
    trackingName,
    style,
    title,
}: ScreenProps) {
    const styles = StyleSheet.create({
        extraParentStyles: {
            flexDirection: "column",
            justifyContent: "flex-start",
        },
        modal_top_bar: {
            width: "100%",
            height: theme.spacing.$12,
            justifyContent: "center",
            alignItems: "center",
            marginTop: Platform.OS === "android" ? theme.spacing.$8 : 0,
        },
    });

    useEffect(() => {
        segmentClient.screen(trackingName);
    }, []);

    return (
        <BackgroundEffect extraParentStyles={[styles.extraParentStyles, style]}>
            <View style={styles.modal_top_bar}>
                <Text variant="heading_small" color="content_1">
                    {title}
                </Text>
            </View>
            {children}
        </BackgroundEffect>
    );
}
