import { Canvas, Circle } from "@shopify/react-native-skia";
import { useUserState } from "../../state/userState";
import { Text, theme } from "../../ui";
import { YStack, ZStack } from "../../ui/stack";
import { Image } from "expo-image";
import { images } from "../../config/constants/images";
import { Platform } from "react-native";
import { responsiveScreenFontSize } from "../../config/constants/responsiveCalculations";

function PointsIcon({ currentPoints }: { currentPoints: number }) {
    return (
        <ZStack
            width={null}
            height={null}
            style={{
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Image
                style={{
                    width:
                        Platform.OS === "ios"
                            ? 198
                            : responsiveScreenFontSize(22),
                    height:
                        Platform.OS === "ios"
                            ? 198
                            : responsiveScreenFontSize(22),
                }}
                source={images.orangeAuraBackdrop}
                contentFit="cover"
                transition={1000}
            />

            <YStack
                justifyContent={"center"}
                alignItems={"center"}
                width={null}
                style={{ position: "absolute" }}
            >
                <Image
                    style={{
                        width:
                            Platform.OS === "ios"
                                ? 180
                                : responsiveScreenFontSize(20),
                        height:
                            Platform.OS === "ios"
                                ? 180
                                : responsiveScreenFontSize(20),
                    }}
                    source={images.pointsFeatureIcon}
                    contentFit="cover"
                    transition={1000}
                />
                <Text
                    variant="heading_large_italic"
                    color={"content_primary"}
                    style={{
                        textAlign: "center",
                        fontSize: 50,
                    }}
                >
                    {currentPoints ?? 0}
                </Text>
                <Text
                    variant="heading_small_italic"
                    color={"content_primary"}
                    style={{
                        textAlign: "center",
                    }}
                >
                    points
                </Text>
            </YStack>
        </ZStack>
    );
}

export default function MyPoints() {
    const currentPoints = useUserState().userDetails.points;

    return (
        <YStack
            justifyContent={"center"}
            alignItems={"center"}
            width={"100%"}
            gap={theme.spacing.$10}
        >
            <PointsIcon currentPoints={currentPoints} />
            <Text
                variant="body_post_content_italic"
                color={"content_primary"}
                style={{
                    textAlign: "center",
                    paddingHorizontal: theme.spacing.$4,
                    opacity: 0.7,
                }}
            >
                {`🚀 Earn points for exploring and sharing apps. Each step, a token of appreciation. Unlock exclusive perks!`}
            </Text>
        </YStack>
    );
}
