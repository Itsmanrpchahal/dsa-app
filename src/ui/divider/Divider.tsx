import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import theme from "../theme/theme";

export interface DividerProps {
    orientation: "horizontal" | "vertical";
    opacity: number;
    thickness?: number;
    color?: string;
    style?: ViewStyle;
}

export function Divider({
    orientation = "horizontal",
    color,
    opacity,
    thickness = 1,
    style,
}: DividerProps) {
    const styles = StyleSheet.create({
        divider: {
            backgroundColor: color ?? theme.colors.content_primary + "50",
            width: orientation === "vertical" ? thickness : "100%",
            height: orientation === "horizontal" ? thickness : "100%",
            opacity: opacity,
            alignSelf: "center",
        },
    });

    return <View style={[styles.divider, style]} />;
}

export default Divider;
