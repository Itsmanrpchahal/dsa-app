import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";
import { images } from "../../config/constants/images";
import { useLandingStackNavigation } from "../../navigation/types";
import { TextButton, theme } from "../../ui";
import { PlainStackScreen } from "../../ui/screens";
import { YStack } from "../../ui/stack";

export default function LandingScreen() {
    const navigation = useLandingStackNavigation();

    const styles = StyleSheet.create({
        image_background: {
            flex: 1,
        },
        brand_logo: {
            width: 150,
            height: 150,
        },
    });

    return (
        <PlainStackScreen trackingName="Landing Screen">
            <YStack
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                style={{
                    flex: 1,
                    height: theme.dimensions.fullHeight,
                    marginBottom: theme.spacing.$8,
                }}
            >
                <View />
                <Image
                    source={images.rocketLogo}
                    style={styles.brand_logo}
                    contentFit="contain"
                />
                <TextButton
                    label="Get Started"
                    buttonColor={theme.colors.color_green}
                    labelColor={theme.colors.dark}
                    onPress={() => {
                        navigation.navigate("UserIdVerifyFlow");
                    }}
                    trackingName="Get Started Button In Landing Screen"
                />
            </YStack>
        </PlainStackScreen>
    );
}
