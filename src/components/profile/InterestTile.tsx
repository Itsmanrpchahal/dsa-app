import { Pressable, StyleSheet, View } from "react-native";
import { Text, theme } from "../../ui";
import { useState } from "react";

export interface InterestTileProps {
    interest_emoji: string;
    interest_name: string;
    selected: boolean;
}

export default function InterestTile(props: InterestTileProps) {
    const styles = StyleSheet.create({
        parent_view: {
            borderRadius: theme.spacing.$3,
            overflow: "hidden",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "center",

            padding: theme.spacing.$4,
            rowGap: theme.spacing.$4,
            width: theme.dimensions.fullWidth * 0.3,
        },
    });

    const dynamicStyle = {
        backgroundColor: props.selected
            ? theme.colors.color_1
            : theme.colors.base_1,
    };

    return (
        <View style={[styles.parent_view, dynamicStyle]}>
            <Text variant="heading_large" color="light">
                {props.interest_emoji}
            </Text>
            <Text variant="body_small" color="light">
                {props.interest_name}
            </Text>
        </View>
    );
}
