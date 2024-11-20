import React, { Ref } from "react";
import {
    StyleSheet,
    ViewStyle,
    TextInput,
    KeyboardTypeOptions,
    TextInputProps,
    DimensionValue,
    Platform,
} from "react-native";
import theme from "../theme/theme";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons"; // or any other icon library
import { Clickable } from "../clickable";

type TextInputFieldProps = TextInputProps & {
    width: DimensionValue;
    placeholder: string;
    placeholderTextColor?: string;
    onChangeText: any;
    keyboardType: KeyboardTypeOptions;
    value: string;
    marginTop?: number;
    marginBottom?: number;
    style?: ViewStyle;
    letterSpacing?: number;
    caretHidden?: boolean;
    autoFocus?: boolean;
    textAlign?: "left" | "center" | "right";
    maxLength?: number;
    selection?: { start: number; end?: number | undefined };
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    autoCorrect?: boolean;
    textContentType?: "name" | "emailAddress" | "password" | "username";
    ref?: Ref<TextInput>;
};

export function TextInputField({
    width = theme.dimensions.fullWidth * 0.9,
    placeholder,
    placeholderTextColor = theme.colors.content_primary + "50",
    onChangeText,
    keyboardType,
    value,
    marginTop,
    marginBottom,
    style,
    letterSpacing = 0,
    caretHidden = false,
    autoFocus = false,
    textAlign = "left",
    maxLength,
    selection,
    autoCapitalize = "none",
    autoCorrect = false,
    textContentType,
    ref,
}: TextInputFieldProps) {
    const styles = StyleSheet.create({
        text_input_container: {
            width: width,
            height: theme.spacing.$12,
            marginTop: marginTop,
            marginBottom: marginBottom,
            justifyContent: "center",
            paddingHorizontal: theme.spacing.$4,
            alignItems: "center",
            flexDirection: "row",
            borderWidth: 1,
            borderRadius: 9,
            borderColor: theme.colors.content_primary + 10,
            backgroundColor: theme.colors.base_primary + 50,
        },
        textInputStyle: {
            textAlign: "left",
            color: theme.colors.content_primary,
            ...theme.textVariants.body_large,
            width: Platform.OS === "android" && value.length ? "94%" : "100%",
            letterSpacing: letterSpacing,
        },
    });

    return (
        <BlurView
            intensity={Platform.OS === "ios" ? 2 : 0}
            style={styles.text_input_container}
        >
            <TextInput
                ref={ref}
                style={[styles.textInputStyle, style]}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                value={value}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                onChangeText={onChangeText}
                selectionColor={theme.colors.content_primary}
                autoCorrect={autoCorrect}
                caretHidden={caretHidden}
                autoFocus={autoFocus}
                textAlign={textAlign}
                maxLength={maxLength}
                selection={selection}
                textContentType={textContentType}
                underlineColorAndroid={"transparent"}
                clearButtonMode="always"
            />
            {Platform.OS === "android" && value.length > 0 && (
                <Clickable
                    onPress={() => {
                        onChangeText("");
                    }}
                    trackingName=""
                >
                    <Ionicons
                        name="ios-close-circle"
                        size={22}
                        color={theme.colors.content_primary + 30}
                    />
                </Clickable>
            )}
        </BlurView>
    );
}

export default TextInputField;
