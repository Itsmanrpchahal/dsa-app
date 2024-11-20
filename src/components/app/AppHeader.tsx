import { Image } from "expo-image";
import { XStack, YStack, ZStack } from "../../ui/stack";
import { Text, theme } from "../../ui";
import * as WebBrowser from "expo-web-browser";
import { images } from "../../config/constants/images";
import { StyleSheet } from "react-native";
import AppRatingsAndReviews from "./AppRatingsAndReviews";
import { SquircleImage } from "../../ui/image";

export interface AppHeaderProps {
    appName: string;
    appRating: string;
    appVisits: string;
    appCategory: string;
    appLogoUrl: string;
}

export default function AppHeader({
    appName,
    appRating,
    appVisits,
    appCategory,
    appLogoUrl,
}: AppHeaderProps) {
    const styles = StyleSheet.create({
        shadowProps: {
            shadowColor: theme.colors.content_primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.35,
            shadowRadius: 3,
        },
    });

    return (
        <ZStack
            height={null}
            width={theme.dimensions.fullWidth * 0.9}
            style={{
                justifyContent: "center",
                alignItems: "flex-start",
                marginLeft: theme.spacing.$2,
                position: "relative",
            }}
        >
            <Image
                style={{
                    width: 300,
                    height: 300,
                    marginLeft: -theme.spacing.$12,
                    marginTop: -theme.spacing.$8,
                }}
                source={images.pinkAuraBackdrop}
                contentFit="cover"
                transition={1000}
            />
            <YStack
                alignItems="center"
                justifyContent="center"
                width={theme.dimensions.fullWidth * 0.9}
                gap={40}
                style={{ position: "absolute", top: theme.spacing.$10 }}
            >
                <XStack
                    alignItems="center"
                    justifyContent="flex-start"
                    width={theme.dimensions.fullWidth * 0.9}
                    gap={50}
                    style={{
                        marginLeft: theme.spacing.$6,
                    }}
                >
                    <SquircleImage
                        style={{
                            width: 90,
                            height: 90,
                            backgroundColor: theme.colors.base_primary + "75",
                            ...styles.shadowProps,
                        }}
                        contentFit="cover"
                        transition={1000}
                        source={appLogoUrl}
                        placeholder={require("../../../assets/blur-image-placeholder.png")}
                        cornerRadius={theme.spacing.$2}
                    />
                    <YStack
                        justifyContent={"center"}
                        alignItems={"flex-start"}
                        width={null}
                        gap={10}
                        style={{ marginLeft: -theme.spacing.$4 }}
                    >
                        <Text
                            variant="body_small_italic"
                            color={"content_1"}
                            opacity={0.5}
                        >
                            {appCategory}
                        </Text>
                        <Text variant="heading_small" color={"content_1"}>
                            {appName}
                        </Text>
                    </YStack>
                </XStack>
                <AppRatingsAndReviews
                    appRating={appRating ?? ""}
                    appVisits={appVisits ?? ""}
                />
            </YStack>
        </ZStack>
    );
}
