import { MotiPressable, mergeAnimateProp } from "moti/interactions";
import { ComponentProps } from "react";
import { PressableProps } from "react-native";
import * as Haptics from "expo-haptics";
import { segmentClient } from "../../config/segmentClient";

type MotiAnimationProps = ComponentProps<typeof MotiPressable>;

export type ClickableProps = MotiAnimationProps &
    PressableProps & {
        trackingName: string;
        children: React.ReactNode;
        trackingParameters?: Record<string, any>;
        disabled?: boolean;
    };

export function Clickable({
    onPress,
    trackingName,
    children,
    disabled = false,
    trackingParameters,
    animate,
    ...props
}: ClickableProps) {
    return (
        <MotiPressable
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                // analytics
                segmentClient.track(trackingName, trackingParameters);

                onPress && onPress();
            }}
            disabled={disabled}
            animate={(interaction) => {
                "worklet";

                return mergeAnimateProp(interaction, animate, {
                    scale: interaction.pressed ? 0.9 : 1,
                });
            }}
            {...props}
        >
            {children}
        </MotiPressable>
    );
}
