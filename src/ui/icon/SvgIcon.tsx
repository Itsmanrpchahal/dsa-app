import {
    BlendMode,
    Canvas,
    Group,
    ImageSVG,
    Skia,
} from "@shopify/react-native-skia";
import * as Haptics from "expo-haptics";
import { useCallback, useMemo } from "react";
import { Pressable, PressableProps } from "react-native";
import { Clickable } from "../clickable";

type SvgIconProps = PressableProps & {
    svgOfIcon: string;
    iconColor: string;
    trackingName: string;
    trackingPrarameters?: Record<string, any>;
    onPress?: () => void;
    disabled?: boolean;
    size?: number; // for width and height
    notClickable?: boolean;
};

const SvgIcon = ({
    svgOfIcon,
    iconColor,
    onPress,
    disabled = false,
    size = 25,
    notClickable = false,
    trackingName,
    trackingPrarameters,
    ...rest
}: SvgIconProps) => {
    const svg = Skia.SVG.MakeFromString(svgOfIcon ? svgOfIcon : "");

    const paint = useMemo(() => Skia.Paint(), []);
    paint.setColorFilter(
        Skia.ColorFilter.MakeBlend(
            Skia.Color(iconColor ? iconColor : ""),
            BlendMode.SrcIn
        )
    );

    const handlePress = useCallback(() => {
        if (disabled) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress && onPress();
    }, [disabled, onPress]);

    if (notClickable) {
        return (
            <Canvas style={{ width: size, height: size }}>
                <Group layer={paint}>
                    <ImageSVG
                        svg={svg}
                        x={0}
                        y={0}
                        width={size}
                        height={size}
                    />
                </Group>
            </Canvas>
        );
    }

    return (
        <Clickable
            trackingName={trackingName}
            onPress={handlePress}
            trackingParameters={trackingPrarameters}
        >
            <Canvas style={{ width: size, height: size }}>
                <Group layer={paint}>
                    <ImageSVG
                        svg={svg}
                        x={0}
                        y={0}
                        width={size}
                        height={size}
                    />
                </Group>
            </Canvas>
        </Clickable>
    );
};

export default SvgIcon;
