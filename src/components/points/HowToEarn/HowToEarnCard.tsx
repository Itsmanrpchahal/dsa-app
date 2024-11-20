import { SquircleView } from "react-native-figma-squircle";
import { Text, theme } from "../../../ui";
import { XStack, YStack, ZStack } from "../../../ui/stack";
import { Canvas, Circle, Path, Skia } from "@shopify/react-native-skia";
import { Image } from "expo-image";
import { View } from "react-native";
import { Card } from "../../../ui/card";
import { images } from "../../../config/constants/images";

function PointsBackground() {
    const width = theme.dimensions.fullWidth * 0.25;

    const path = Skia.Path.Make();
    path.moveTo(0, 0);
    path.lineTo(width, width * 2);
    path.lineTo(width, 0);
    path.close();

    return (
        <Canvas
            style={{
                width: width,
                height: "100%",
            }}
        >
            <Path path={path} color={theme.colors.color_1} opacity={0.5} />
        </Canvas>
    );
}

type HowToEarnCardProps = {
    label: string;
    description?: string;
    points: number;
    comingSoon?: boolean;
    completed?: boolean;
};

export default function HowToEarnCard({
    label,
    description,
    points,
    comingSoon = false,
    completed = false,
}: HowToEarnCardProps) {
    function Description() {
        return (
            <YStack
                gap={theme.spacing.$2}
                justifyContent={"center"}
                alignItems={"flex-start"}
                width={theme.dimensions.fullWidth * 0.65}
                style={{
                    padding: theme.spacing.$4,
                }}
            >
                <XStack
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={null}
                    gap={theme.spacing.$1}
                >
                    <Text variant="heading_small" color={"content_1"}>
                        {label}
                    </Text>
                    <Text
                        variant="body_small"
                        color={
                            comingSoon
                                ? "color_2"
                                : completed
                                ? "negative"
                                : "positive"
                        }
                    >
                        {comingSoon
                            ? "(coming soon)"
                            : completed
                            ? "(completed)"
                            : "(live)"}
                    </Text>
                </XStack>
                <Text
                    variant="caption"
                    color={"content_1"}
                    style={{
                        opacity: 0.75,
                    }}
                >
                    {description}
                </Text>
            </YStack>
        );
    }

    function Points() {
        return (
            <ZStack
                width={null}
                height={null}
                style={{
                    justifyContent: "center",
                    alignItems: "flex-end",
                }}
            >
                {/* <PointsBackground /> */}
                <XStack
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={null}
                    gap={theme.spacing.$1}
                    style={{
                        position: "absolute",
                        padding: theme.spacing.$2,
                    }}
                >
                    <Text
                        variant="heading_small_italic"
                        color={"content_1"}
                        style={{
                            textAlign: "center",
                        }}
                    >
                        {points}
                    </Text>
                    <Image
                        style={{ width: 21, height: 21 }}
                        source={images.pointsFeatureIcon}
                    />
                </XStack>
            </ZStack>
        );
    }

    return (
        <Card
            trackingName="How To Earn Points Card"
            cardParentStyle={{
                width: theme.dimensions.fullWidth * 0.9,
            }}
            color={theme.colors.content_primary + "05"}
            blur={true}
            borderRadius={theme.spacing.$3}
        >
            <XStack
                justifyContent={"space-between"}
                alignItems={"center"}
                width={"100%"}
                style={{
                    overflow: "hidden",
                }}
            >
                <Description />
                <Points />
            </XStack>
        </Card>
    );
}
