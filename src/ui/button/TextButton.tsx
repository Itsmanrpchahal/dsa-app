import {
    BlendMode,
    Canvas,
    Group,
    ImageSVG,
    Skia,
} from "@shopify/react-native-skia";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { MotiPressable, mergeAnimateProp } from "moti/interactions";
import React, { ComponentProps, useCallback, useMemo } from "react";
import { PressableProps } from "react-native";
import { SquircleParams, SquircleView } from "react-native-figma-squircle";
import { XStack } from "../stack";
import { Text } from "../text";
import theme from "../theme/theme";
import { segmentClient } from "../../config/segmentClient";

type MotiAnimationProps = ComponentProps<typeof MotiPressable>;

type TextButtonProps = PressableProps &
    MotiAnimationProps & {
        onPress: () => void;
        trackingName: string;
        trackingParameters?: Record<string, any>;
        label: string;
        buttonColor: string;
        labelColor: string;
        squircleParams?: SquircleParams;
        disabled?: boolean;
        small?: boolean;
        icon?: string;
        image?: string;
        widthOfButton?: number;
    };

type ElementProps = {
    icon?: string;
    labelColor?: string;
    image?: string;
};

const Element = ({ icon, image, labelColor }: ElementProps) => {
    const svg = Skia.SVG.MakeFromString(icon ? icon : "");

    const paint = useMemo(() => Skia.Paint(), []);
    paint.setColorFilter(
        Skia.ColorFilter.MakeBlend(
            Skia.Color(labelColor ? labelColor : ""),
            BlendMode.SrcIn
        )
    );

    return (
        <>
            {icon && (
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
            )}
            {image && (
                <Image
                    style={{
                        width: 25,
                        height: 25,
                        borderRadius: 15,
                    }}
                    source="https://i.postimg.cc/wTNTPwrF/sample-dp.webp"
                    contentFit="cover"
                    transition={1000}
                />
            )}
        </>
    );
};

export const TextButton = React.memo(
    ({
        animate,
        label,
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
        small = false,
        icon,
        image,
        widthOfButton,
    }: TextButtonProps) => {
        const widthOfButtonCalculated =
            widthOfButton ?? theme.dimensions.fullWidth * (small ? 0.425 : 0.9);

        const handlePress = useCallback(() => {
            if (disabled) return;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            // analytics
            segmentClient.track("Button Pressed", {
                name: trackingName,
                ...trackingParameters,
            });
            onPress();
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
                        opacity: disabled ? 0.5 : 1,
                        width: widthOfButtonCalculated,
                        height: 60, // button height manual declaration as per the design system
                    }}
                >
                    <XStack
                        gap={theme.spacing.$2}
                        alignItems="center"
                        justifyContent="center"
                        width="auto"
                        style={{ flex: 1 }}
                    >
                        {icon && (
                            <Element icon={icon} labelColor={labelColor} />
                        )}
                        {image && <Element image={image} />}
                        <Text
                            variant="button_large"
                            style={{
                                color: labelColor,
                                textAlign: "center",
                            }}
                        >
                            {label}
                        </Text>
                    </XStack>
                </SquircleView>
            </MotiPressable>
        );
    }
);
