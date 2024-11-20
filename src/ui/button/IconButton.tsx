import {
    BlendMode,
    Canvas,
    Group,
    ImageSVG,
    Skia,
} from "@shopify/react-native-skia";
import * as Haptics from "expo-haptics";
import { MotiPressable, mergeAnimateProp } from "moti/interactions";
import React, { ComponentProps, useCallback, useMemo } from "react";
import { PressableProps } from "react-native";
import { SquircleParams, SquircleView } from "react-native-figma-squircle";
import { segmentClient } from "../../config/segmentClient";

type MotiAnimationProps = ComponentProps<typeof MotiPressable>;

type IconButtonProps = PressableProps &
    MotiAnimationProps & {
        onPress: () => void;
        trackingName: string;
        icon: string;
        buttonColor: string;
        labelColor: string;
        trackingParameters?: Record<string, any>;
        squircleParams?: SquircleParams;
        disabled?: boolean;
        size?: number; // for width and height
    };

export const IconButton = ({
    animate,
    icon,
    onPress,
    trackingName,
    trackingParameters,
    buttonColor,
    labelColor,
    squircleParams = {
        cornerSmoothing: 1,
        cornerRadius: 15,
        fillColor: buttonColor,
    },
    disabled = false,
    size,
    ...rest
}: IconButtonProps) => {
    const svg = Skia.SVG.MakeFromString(icon ? icon : "");

    const paint = useMemo(() => Skia.Paint(), []);
    paint.setColorFilter(
        Skia.ColorFilter.MakeBlend(
            Skia.Color(labelColor ? labelColor : ""),
            BlendMode.SrcIn
        )
    );

    const handlePress = useCallback(() => {
        if (disabled) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // analytics
        segmentClient.track("Button Pressed", {
            name: trackingName,
            ...trackingParameters,
        });
        onPress && onPress();
    }, [disabled, onPress]);

    return (
        <MotiPressable
            onPress={handlePress}
            disabled={disabled}
            animate={(interaction) => {
                "worklet";

                return mergeAnimateProp(interaction, animate, {
                    scale: interaction.pressed ? 0.9 : 1,
                });
            }}
        >
            <SquircleView
                squircleParams={squircleParams}
                style={{
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: disabled ? 0.5 : 1,
                    width: size ?? 40,
                    height: size ?? 40,
                }}
            >
                <Canvas style={{ width: 25, height: 25 }}>
                    <Group layer={paint}>
                        <ImageSVG
                            svg={svg}
                            x={0}
                            y={0}
                            width={25}
                            height={25}
                        />
                    </Group>
                </Canvas>
            </SquircleView>
        </MotiPressable>
    );
};
