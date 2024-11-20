import { Image } from "expo-image";
import { Text, theme } from "../../ui";
import { YStack, ZStack } from "../../ui/stack";
import { PUBLIC_APP_NAME } from "@env";
import { images } from "../../config/constants/images";
import { Platform } from "react-native";
import { responsiveScreenFontSize } from "../../config/constants/responsiveCalculations";

export default function InviteIntroComponent() {
    return (
        <YStack
            justifyContent={"center"}
            alignItems={"center"}
            width={"100%"}
            gap={theme.spacing.$2}
        >
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
                                ? 180
                                : responsiveScreenFontSize(20),
                        height:
                            Platform.OS === "ios"
                                ? 180
                                : responsiveScreenFontSize(20),
                    }}
                    source={images.pinkAuraBackdrop}
                    contentFit="cover"
                    transition={1000}
                />
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
                        position: "absolute",
                    }}
                    source={images.inviteFeatureIcon}
                    contentFit="cover"
                    transition={1000}
                />
            </ZStack>
            <Text
                variant="body_small"
                color={"content_1"}
                style={{
                    opacity: 0.75,
                    textAlign: "left",
                    width: theme.dimensions.fullWidth * 0.8,
                }}
            >
                {`🚀 Invite your friends to ${PUBLIC_APP_NAME} and earn points for each friend who signs up! \n \n 🌟 Bonus, you will earn a share of the points they earn. 🎉`}
            </Text>
        </YStack>
    );
}
