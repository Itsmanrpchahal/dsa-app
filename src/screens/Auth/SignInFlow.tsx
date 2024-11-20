import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { images } from "../../config/constants/images";
import { segmentClient } from "../../config/segmentClient";
import { fetchOnLanch } from "../../helpers/general";
import { useAuthState } from "../../state";
import { useUserState } from "../../state/userState";
import { Text, TextButton, theme } from "../../ui";
import { PlainStackScreen } from "../../ui/screens";
import { YStack, ZStack } from "../../ui/stack";

export default function SignInFlow() {
    const styles = StyleSheet.create({
        image_background: {
            flex: 1,
        },
        brand_logo: {
            width: 150,
            height: 150,
        },
        button_loader_container: {
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
            marginTop: theme.spacing.$3,
        },
    });

    const userDetails = useUserState().userDetails;

    const [settingUp, setSettingUp] = useState<boolean>(true);

    useEffect(() => {
        if (userDetails.uuid) {
            fetchOnLanch();

            setTimeout(() => {
                // time delay until success message to shown
                segmentClient.track("Success", {
                    detail: "Sign In Welcome Back Page: sign in process finished",
                });

                setSettingUp(false);
            }, 3000);
        } else {
            segmentClient.track("Error", {
                detail: "Sign In Welcome Back Page: uuid not found",
            });
            useAuthState.getState().setAuthDetails({
                name: "",
                loggedIn: false,
                onboardingState: null,
            });
        }
    }, []);

    return (
        <PlainStackScreen trackingName="SignInFlow">
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
                <YStack
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={"100%"}
                    gap={theme.spacing.$7}
                >
                    <Image
                        source={images.rocketLogo}
                        style={styles.brand_logo}
                        contentFit="contain"
                    />
                    <Text
                        variant="body_large"
                        color="content_primary"
                        style={{
                            textAlign: "center",
                            maxWidth: theme.dimensions.fullWidth * 0.75,
                        }}
                    >
                        {`welcome back ${
                            userDetails.name ?? ""
                        }, we’ve missed you & we’re glad you are back!`}
                    </Text>
                </YStack>
                <ZStack
                    width={null}
                    height={null}
                    style={styles.button_loader_container}
                >
                    <TextButton
                        label="Start dAppStore"
                        buttonColor={theme.colors.color_green}
                        labelColor={theme.colors.dark}
                        onPress={() => {
                            useAuthState.getState().setAuthDetails({
                                name: userDetails.name ?? "",
                                loggedIn: true,
                                onboardingState: "finished",
                            });
                        }}
                        trackingName="Start dAppStore Button SignInFlow"
                        disabled={settingUp ? true : false}
                    />
                    {settingUp && (
                        <ActivityIndicator
                            size="small"
                            color={theme.colors.content_1}
                            style={{ position: "absolute" }}
                        />
                    )}
                </ZStack>
            </YStack>
        </PlainStackScreen>
    );
}
