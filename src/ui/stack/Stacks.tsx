import { DimensionValue, StyleSheet, View } from "react-native";

import { ViewProps } from "react-native";

export interface StackProps extends ViewProps {
    children: React.ReactNode;
    gap?: number;
    justifyContent:
        | "flex-start"
        | "center"
        | "flex-end"
        | "space-between"
        | "space-around"
        | "space-evenly";
    alignItems: "flex-start" | "center" | "flex-end" | "stretch" | "baseline";
    width: DimensionValue;
    style?: any;
}

export function XStack({
    children,
    gap,
    justifyContent,
    alignItems,
    width,
    style,
    ...props
}: StackProps) {
    const styles = StyleSheet.create({
        stack_view: {
            flexDirection: "row",
            justifyContent: justifyContent,
            alignItems: alignItems,
            columnGap: gap,
            width: width,
            ...style,
        },
    });

    return (
        <View style={styles.stack_view} {...props}>
            {children}
        </View>
    );
}

export function YStack({
    children,
    gap,
    justifyContent,
    alignItems,
    width,
    style,
    ...props
}: StackProps) {
    const styles = StyleSheet.create({
        stack_view: {
            flexDirection: "column",
            justifyContent: justifyContent,
            alignItems: alignItems,
            rowGap: gap,
            width: width,
            ...style,
        },
    });

    return (
        <View style={styles.stack_view} {...props}>
            {children}
        </View>
    );
}

export interface ZStackProps extends ViewProps {
    children: React.ReactNode;
    width: DimensionValue;
    height: DimensionValue;
    style?: any;
}

export function ZStack({
    children,
    width,
    height,
    style,
    ...props
}: ZStackProps) {
    const styles = StyleSheet.create({
        stack_view: {
            // position: "absolute",
            width: width,
            height: height,
            ...style,
        },
    });

    return (
        <View style={styles.stack_view} {...props}>
            {children}
        </View>
    );
}
