import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { MotiPressable } from "moti/interactions";
import React, { ComponentProps, useCallback } from "react";
import { Platform, PressableProps, StyleProp, ViewStyle } from "react-native";
import { SquircleParams, SquircleView } from "react-native-figma-squircle";
import { Clickable } from "../clickable";
import theme from "../theme/theme";

type MotiAnimationProps = ComponentProps<typeof MotiPressable>;

export type CardProps = PressableProps &
    MotiAnimationProps & {
        children: React.ReactNode;
        trackingName: string;
        trackingPrarameters?: Record<string, any>;
        borderRadius?: number;
        color?: string;
        onPress?: () => void;
        squircleParams?: SquircleParams;
        disabled?: boolean;
        cardParentStyle?: StyleProp<ViewStyle>;
        blur?: boolean;
    };

interface SquircleWrapperProps {
    children: React.ReactNode;
    squircleParams: SquircleParams;
    borderRadius: number;
    blur: boolean;
    color: string;
    style?: StyleProp<ViewStyle>;
}

const SquircleWrapper = ({
    children,
    squircleParams,
    borderRadius,
    style,
    blur,
    color,
}: SquircleWrapperProps) => {
    if (blur) {
        return (
            <BlurView
                style={[
                    {
                        overflow: "hidden",
                        backgroundColor: color,
                        borderRadius: borderRadius,
                    },
                    style,
                ]}
                intensity={Platform.OS === 'ios' ? 10 :0}
                tint={'light'}
                blurReductionFactor={50}
            >
                {children}
            </BlurView>
        );
    }

    return (
        <SquircleView squircleParams={squircleParams} style={style}>
            {children}
        </SquircleView>
    );
};

export function Card({
    animate,
    onPress,
    trackingName,
    trackingPrarameters,
    children,
    color,
    borderRadius,
    squircleParams = {
        cornerSmoothing: 1,
        cornerRadius: borderRadius ?? theme.spacing.$3,
        fillColor: color ?? theme.colors.base_primary + "50",
    },
    disabled = false,
    cardParentStyle,
    blur = false,
}: CardProps) {
    const handlePress = useCallback(() => {
        if (onPress) {
            onPress();
        }
    }, []);

    return (
        <>
            {onPress ? (
                <Clickable
                    onPress={handlePress}
                    disabled={disabled}
                    trackingName={trackingName}
                    trackingParameters={trackingPrarameters}
                >
                    <SquircleWrapper
                        squircleParams={squircleParams}
                        style={cardParentStyle}
                        blur={blur}
                        color={color ?? theme.colors.base_primary + "50"}
                        borderRadius={borderRadius ?? theme.spacing.$3}
                    >
                        {children}
                    </SquircleWrapper>
                </Clickable>
            ) : (
                <SquircleWrapper
                    squircleParams={squircleParams}
                    style={cardParentStyle}
                    blur={blur}
                    color={color ?? theme.colors.base_primary + "50"}
                    borderRadius={borderRadius ?? theme.spacing.$3}
                >
                    {children}
                </SquircleWrapper>
            )}
        </>
    );
}
