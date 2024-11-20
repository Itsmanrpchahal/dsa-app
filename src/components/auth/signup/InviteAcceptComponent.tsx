import * as Burnt from "burnt";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import {
    ActivityIndicator,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { acceptInvite } from "../../../helpers/auth/api/acceptInvite";
import { Text, theme } from "../../../ui";
import { IconButton, TextButton } from "../../../ui/button";
import { Divider } from "../../../ui/divider";
import { YStack, ZStack } from "../../../ui/stack";
import { segmentClient } from "../../../config/segmentClient";
import { svgIcons } from "../../../config/constants/iconSvgs";
import { Clickable } from "../../../ui/clickable";
import TextInputField from "../../../ui/textInput/TextInput";

const styles = StyleSheet.create({
    parent: {
        flex: 1,
    },
    accept_invite_body: {},
    invite_code_container: {
        width: theme.dimensions.fullWidth * 0.9,
        justifyContent: "space-between",
        flexDirection: "row",
        height: theme.dimensions.fullHeight * 0.1,
    },
    text_input_container: {
        width: "auto",
        height: 60,
        justifyContent: "space-between",
        paddingHorizontal: theme.spacing.$4,
        alignItems: "center",
        flexDirection: "row",
        borderWidth: 1,
        borderRadius: 9,
        borderColor: theme.colors.textInput_border,
        backgroundColor: theme.colors.textInput_background,
    },
    button_loader_container: {
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
    divider: {
        width: theme.dimensions.fullWidth * 0.9,
        marginVertical: theme.spacing.$2,
    },
    body: {
        height: theme.dimensions.fullHeight * 0.5,
    },

    find_invite_body: {},
});

type InviteAcceptComponentProps = {
    handleInviteAccept: () => void;
};

export default function InviteAcceptComponent({
    handleInviteAccept,
}: InviteAcceptComponentProps) {
    const [invite, setInvite] = useState<string>("");
    const [checkingInvite, setCheckingInvite] = useState<boolean>(false);

    const fetchCopiedText = async () => {
        const text = await Clipboard.getStringAsync();
        setInvite(text);
    };

    const handleInviteSubmit = async () => {
        setCheckingInvite(true);
        const acceptInviteResponse = await acceptInvite(invite);

        if (acceptInviteResponse.success) {
            handleInviteAccept();
            setCheckingInvite(false);
        } else {
            console.log("error accepting invite", acceptInviteResponse);

            segmentClient.track("Wrong/Expired Invite Code");

            Burnt.toast({
                title: "Invite code invalid or expired",
                preset: "error",
            });
            setCheckingInvite(false);
        }
    };

    return (
        <ScrollView keyboardShouldPersistTaps="handled">
            <YStack
                justifyContent={"space-between"}
                alignItems={"center"}
                width={null}
                style={styles.parent}
                gap={theme.spacing.$8}
            >
                <YStack
                    style={styles.accept_invite_body}
                    justifyContent={"flex-start"}
                    alignItems={"center"}
                    width={null}
                    gap={theme.spacing.$10}
                >
                    <Text variant="heading_small" color="light">
                        INVITE CODE
                    </Text>
                    <View style={styles.invite_code_container}>
                        <TextInputField
                            width={theme.dimensions.fullWidth * 0.7}
                            keyboardType={"default"}
                            value={invite}
                            onChangeText={setInvite}
                            placeholder="enter / paste invite code"
                            caretHidden={false}
                            textAlign="center"
                            autoCorrect={false}
                            autoCapitalize={"characters"}
                        />
                        <View
                            style={[
                                styles.text_input_container,
                                {
                                    width: 60,
                                    paddingHorizontal: theme.spacing.$2,
                                },
                            ]}
                        >
                            <IconButton
                                onPress={() => fetchCopiedText()}
                                trackingName="Paste Invite Code Clicked In Invite Accept Screen"
                                icon={svgIcons.pasteIcon}
                                buttonColor={theme.colors.transparent}
                                labelColor={theme.colors.content_1}
                            />
                        </View>
                    </View>

                    <ZStack
                        width={null}
                        height={null}
                        style={styles.button_loader_container}
                    >
                        <TextButton
                            label="Accept Invite"
                            trackingName="Accept Invite Button Clicked In Invite Accept Screen"
                            labelColor={theme.colors.dark}
                            buttonColor={theme.colors.color_green}
                            onPress={handleInviteSubmit}
                            disabled={!(invite.length > 3) || checkingInvite}
                            small={true}
                        />
                        {checkingInvite && (
                            <ActivityIndicator
                                size="small"
                                color={theme.colors.content_1}
                                style={{ position: "absolute" }}
                            />
                        )}
                    </ZStack>
                </YStack>
                <Divider
                    orientation={"horizontal"}
                    color={theme.colors.content_1}
                    opacity={0.1}
                    style={styles.divider}
                />
                <YStack
                    style={styles.find_invite_body}
                    justifyContent={"flex-start"}
                    alignItems={"flex-start"}
                    width={theme.dimensions.fullWidth * 0.9}
                    gap={theme.spacing.$8}
                >
                    <Text
                        variant="heading_small"
                        color="content_1"
                        textAlign={"left"}
                    >
                        Don't have a code ?
                    </Text>
                    <YStack
                        justifyContent={"space-between"}
                        alignItems={"flex-start"}
                        width={theme.dimensions.fullWidth * 0.85}
                        gap={theme.spacing.$4}
                        style={{ marginLeft: theme.spacing.$2 }}
                    >
                        <View style={{ alignItems: "center" }}>
                            <Text
                                variant="body_large"
                                color="content_1"
                                style={{
                                    textAlign: "left",
                                }}
                            >
                                1. keep an eye on our{" "}
                                <Clickable
                                    trackingName="Farcaster Channel Clicked On Invite Accept Screen"
                                    onPress={() => {
                                        Linking.openURL(
                                            "https://warpcast.com/~/channel/dappstore"
                                        );
                                    }}
                                >
                                    <Text
                                        variant="body_large"
                                        color="color_1"
                                        style={{
                                            transform: [
                                                {
                                                    translateY: 3,
                                                },
                                            ],
                                        }}
                                    >
                                        /dAppStore
                                    </Text>
                                </Clickable>
                                <Text
                                    variant="body_large"
                                    color="content_1"
                                    style={{
                                        textAlign: "left",
                                    }}
                                >
                                    farcaster channel
                                </Text>
                            </Text>
                        </View>
                        <Text
                            variant="body_large"
                            color="content_1"
                            style={{ textAlign: "left", lineHeight: 20 }}
                        >
                            2. ask our community for invite codes on our{" "}
                            <Clickable
                                trackingName="Telegram Group Clicked On Invite Accept Screen"
                                onPress={() => {
                                    Linking.openURL(
                                        "https://t.me/dappstore_app"
                                    );
                                }}
                            >
                                <Text
                                    variant="body_large"
                                    color="color_1"
                                    style={{
                                        transform: [
                                            {
                                                translateY: 3,
                                            },
                                        ],
                                    }}
                                >
                                    telegram group
                                </Text>
                            </Clickable>
                        </Text>

                        <Text
                            variant="body_large"
                            color="content_1"
                            style={{ textAlign: "left" }}
                        >
                            3. we are slowly onboarding more people onto
                            dAppStore and we'll email you a code soon
                        </Text>
                    </YStack>
                </YStack>
            </YStack>
        </ScrollView>
    );
}
