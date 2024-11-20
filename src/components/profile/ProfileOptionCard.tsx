import {
    BlendMode,
    Canvas,
    Group,
    ImageSVG,
    Skia,
} from "@shopify/react-native-skia";
import { useMemo } from "react";
import { Text, theme } from "../../ui";
import { Card } from "../../ui/card";
import { XStack, YStack } from "../../ui/stack";

export interface ProfileOptionCardProps {
    icon: string;
    label: string;
    description: string;
    danger?: boolean;
    onPress?: () => void;
}

export default function ProfileOptionCard({
    icon,
    label,
    description,
    danger,
    onPress,
}: ProfileOptionCardProps) {
    const iconColor = danger ? theme.colors.negative : theme.colors.content_1;

    const svgIcon = Skia.SVG.MakeFromString(icon ? icon : "");

    const paint = useMemo(() => Skia.Paint(), []);
    paint.setColorFilter(
        Skia.ColorFilter.MakeBlend(Skia.Color(iconColor), BlendMode.SrcIn)
    );

    return (
        <Card
            trackingName={`Profile Option Clicked`}
            trackingPrarameters={{
                name: label,
            }}
            cardParentStyle={{
                width: theme.dimensions.fullWidth * 0.9,
                paddingVertical: theme.spacing.$3,
                paddingHorizontal: theme.spacing.$4,
                alignItems: "center",
            }}
            color={theme.colors.content_primary + "05"}
            blur={true}
            onPress={onPress}
            borderRadius={theme.spacing.$3}
        >
            <XStack
                gap={2}
                justifyContent={"space-between"}
                alignItems={"center"}
                width={"100%"}
            >
                <YStack
                    justifyContent={"center"}
                    alignItems={"flex-start"}
                    width={null}
                    gap={theme.spacing.$2}
                >
                    <Text
                        variant="body_large"
                        color={danger ? "negative" : "content_1"}
                    >
                        {label}
                    </Text>
                    <Text
                        variant="caption"
                        color={danger ? "negative" : "content_1"}
                    >
                        {description}
                    </Text>
                </YStack>
                <Canvas style={{ width: 25, height: 25 }}>
                    <Group layer={paint}>
                        <ImageSVG
                            svg={svgIcon}
                            x={0}
                            y={0}
                            width={25}
                            height={25}
                        />
                    </Group>
                </Canvas>
            </XStack>
        </Card>
    );
}
