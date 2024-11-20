import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { XStack, YStack } from "../../../../ui/stack";
import { images } from "../../../../config/constants/images";
import { Text, TextButton, theme } from "../../../../ui";
import { useEffect, useState } from "react";
import { useCurrentTabState } from "../../../../state/currentTabState";
import { ScrollView } from "react-native-gesture-handler";
import { getStringFromHex } from "../../../../helpers/wallet/api/getStringFromHex";
import { useWalletActionState } from "../../../../state/walletActionState";
import { Image } from "expo-image";

const styles = StyleSheet.create({
    image: {
        width: 50,
        height: 50,
        marginBottom: theme.spacing.$3,
    },
    messsageText: {
        marginTop: theme.spacing.$2,
        marginBottom: theme.spacing.$4,
        width: theme.dimensions.fullWidth * 0.8,
    },
    hostName: {
        marginTop: theme.spacing.$6,
    },
    buttonsContainer: {
        marginTop: theme.spacing.$5,
    },
    messageContainer: {
        backgroundColor: theme.colors.base_primary,
        padding: theme.spacing.$3,
        borderRadius: theme.spacing.$3,
        marginBottom: theme.spacing.$5,
        borderWidth: 3,
        borderColor: theme.colors.base_primary,
        maxHeight: 240,
    },
});

export const SignMessageSheet = ({ onConnect }: { onConnect: any }) => {
    const currentTabState = useCurrentTabState();
    const [message, setMessage] = useState<string>("");
    const [loader, setLoader] = useState<boolean>(false);
    const walletActionState = useWalletActionState();

    useEffect(() => {
        setLoader(true);
        getMessage();
    }, [walletActionState]);

    const getMessage = async () => {
        const message = await getStringFromHex(
            walletActionState.walletAction.walletData?.personalSign
        );
        setLoader(false);
        setMessage(message);
    };

    return (
        <YStack
            alignItems={"center"}
            justifyContent={loader ? "center" : "flex-start"}
            width={theme.dimensions.fullWidth * 0.9}
            style={{ minHeight: theme.dimensions.fullHeight * 0.4 }}
        >
            {loader ? (
                <ActivityIndicator
                    style={{
                        position: "absolute",
                        top: "50%",
                    }}
                    size="large"
                    color={theme.colors.brand_green_primary}
                />
            ) : (
                <YStack
                    alignItems="center"
                    justifyContent="flex-start"
                    width={theme.dimensions.fullWidth * 0.9}
                >
                    <Image
                        style={styles.image}
                        source={images.rocketLogo}
                        contentFit="contain"
                    ></Image>

                    <Text variant="heading_small" color="content_primary">
                        {currentTabState.currentTab?.hostname}
                    </Text>
                    <Text
                        variant="heading_small"
                        color="content_primary"
                        style={styles.messsageText}
                        textAlign={"center"}
                        opacity={0.5}
                    >
                        message sign request
                    </Text>

                    <YStack
                        alignItems="flex-start"
                        justifyContent="center"
                        width={theme.dimensions.fullWidth * 0.9}
                        style={styles.messageContainer}
                    >
                        <ScrollView
                            overScrollMode="always"
                            scrollToOverflowEnabled
                            showsVerticalScrollIndicator={true}
                        >
                            <TouchableOpacity activeOpacity={1}>
                                <Text
                                    variant="heading_small"
                                    color="content_primary"
                                    style={styles.messsageText}
                                    textAlign={"left"}
                                >
                                    Message
                                </Text>

                                <Text
                                    variant="body_small"
                                    color="content_primary"
                                    style={styles.messsageText}
                                    opacity={0.75}
                                    textAlign={"left"}
                                >
                                    {message}
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </YStack>
                    <Text
                        variant="heading_small"
                        color="content_primary"
                        opacity={0.5}
                    >
                        does not cost anything
                    </Text>
                    <XStack
                        alignItems={"center"}
                        justifyContent={"space-around"}
                        width={"100%"}
                        style={styles.buttonsContainer}
                    >
                        <TextButton
                            trackingName="Sign Message Cancelled In Sign Message Sheet"
                            trackingParameters={{
                                hostname: currentTabState.currentTab?.hostname,
                            }}
                            widthOfButton={theme.dimensions.fullWidth * 0.4}
                            onPress={() => {
                                onConnect(true);
                            }}
                            label={"Cancel"}
                            buttonColor={theme.colors.off_light}
                            labelColor={theme.colors.dark}
                        />
                        <TextButton
                            trackingName="Sign Message Confirmed In Sign Message Sheet"
                            trackingParameters={{
                                hostname: currentTabState.currentTab?.hostname,
                            }}
                            widthOfButton={theme.dimensions.fullWidth * 0.4}
                            onPress={() => {
                                onConnect(true);
                                walletActionState.walletAction.walletData?.onPositivePress();
                            }}
                            label={"Sign"}
                            buttonColor={theme.colors.brand_green_primary}
                            labelColor={theme.colors.dark}
                        />
                    </XStack>
                </YStack>
            )}
        </YStack>
    );
};
