import { PUBLIC_APP_NAME } from "@env";
import * as Burnt from "burnt";
import { Image } from "expo-image";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { Linking, Platform, StyleSheet } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { ScrollView } from "react-native-gesture-handler";
import ProfileOptionCard from "../components/profile/ProfileOptionCard";
import { svgIcons } from "../config/constants/iconSvgs";
import { images } from "../config/constants/images";
import { logout } from "../helpers/profile/misc/logout";
import { shareApp } from "../helpers/share/misc/shareApp";
import { HomeStackNavigationProp } from "../navigation/types";
import useDailyActivityViewHideState from "../state/helpViewHideState";
import { useUserState } from "../state/userState";
import { Text, theme } from "../ui";
import { Divider } from "../ui/divider";
import { ModalScreen } from "../ui/screens";
import { YStack, ZStack } from "../ui/stack";

export default function ProfileScreen({
    // @ts-ignore
    route,
    // @ts-ignore
    navigation,
}: HomeStackNavigationProp) {
    const displayPicture = route.params.displayPicture;
    const { setDailyActivityViewHide } = useDailyActivityViewHideState();

    const styles = StyleSheet.create({
        blur_view: {
            flex: 1,
            alignItems: "center",
        },
    });

    useEffect(() => {
        setDailyActivityViewHide(false);
    }, []);

    const { clearSession, clearCredentials } = useAuth0();

    return (
        <ModalScreen style={styles.blur_view} trackingName={"Profile Screen"}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <YStack
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={null}
                    gap={10}
                >
                    <YStack
                        justifyContent={"center"}
                        alignItems={"center"}
                        width={null}
                        gap={10}
                        style={{
                            marginVertical:
                                Platform.OS === "android"
                                    ? 0
                                    : theme.spacing.$6,
                        }}
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
                                    width: 150,
                                    height: 150,
                                }}
                                source={images.greenAuraBackdrop}
                                contentFit="cover"
                                transition={1000}
                            />

                            <Image
                                style={{
                                    width: 75,
                                    height: 75,
                                    borderRadius: 75,
                                    position: "absolute",
                                }}
                                source={displayPicture}
                                contentFit="cover"
                                transition={1000}
                            />
                        </ZStack>
                        <Text variant="body_large" color={"content_primary"}>
                            {useUserState.getState().userDetails.name}
                        </Text>
                        <Text variant="caption" color={"content_primary"}>
                            {useUserState.getState().userDetails.email ?? ""}
                        </Text>
                    </YStack>
                    <ProfileOptionCard
                        icon={svgIcons.vaultIcon}
                        label={"vault"}
                        description={"your web3 account"}
                        onPress={() => {
                            navigation.navigate("WalletScreen");
                        }}
                    />
                    <ProfileOptionCard
                        icon={svgIcons.notificationsIcon}
                        label={"notifications"}
                        description={"push notifications"}
                        onPress={() => {
                            Linking.openSettings();
                        }}
                    />
                    <ProfileOptionCard
                        icon={svgIcons.editIcon}
                        label={"edit interests"}
                        description={"coming soon"}
                        onPress={() => {
                            Burnt.toast({
                                title: "coming soon!",
                                preset: "none",
                                message: "",
                            });
                        }}
                    />

                    {Platform.OS === "android" && (
                        <ProfileOptionCard
                            icon={svgIcons.helpIcon}
                            label={"help"}
                            description={"Support and more information"}
                            onPress={() => {
                                navigation.navigate("HelpScreen");
                            }}
                        />
                    )}

                    <Divider
                        orientation={"horizontal"}
                        color={theme.colors.content_1}
                        opacity={1}
                        style={{
                            width: "80%",
                            marginVertical: theme.spacing.$2,
                        }}
                    />

                    <ProfileOptionCard
                        icon={svgIcons.feedbackIcon}
                        label={"feedback"}
                        description="Report issues and provide feedback"
                        onPress={() => {
                            WebBrowser.openBrowserAsync(
                                "https://form.jotform.com/233180392031042"
                            );
                        }}
                    />

                    <ProfileOptionCard
                        icon={svgIcons.shareIcon}
                        label={`share ${PUBLIC_APP_NAME}`}
                        description="Share the love on social media & friends"
                        onPress={() => {
                            shareApp();
                        }}
                    />
                    <ProfileOptionCard
                        icon={svgIcons.twitterIcon}
                        label={`${PUBLIC_APP_NAME} twitter`}
                        description="Follow us on twitter"
                        onPress={() => {
                            Linking.openURL("https://twitter.com/dAppStore_");
                        }}
                    />
                    <Divider
                        orientation={"horizontal"}
                        color={theme.colors.content_1}
                        opacity={1}
                        style={{
                            width: "80%",
                            marginVertical: theme.spacing.$2,
                        }}
                    />

                    <ProfileOptionCard
                        icon={svgIcons.logoutIcon}
                        label={"log out"}
                        description="Remember to collect daily rewards"
                        danger={true}
                        onPress={async () => {
                            await clearSession();
                            await clearCredentials();
                            logout();
                        }}
                    />
                    <ProfileOptionCard
                        icon={svgIcons.deleteIcon}
                        label={"delete account"}
                        description="Permanently delete your account"
                        danger={true}
                        onPress={async () => {
                            WebBrowser.openBrowserAsync(
                                "https://deleteaccount.dappstore.app/"
                            ).then(async () => {
                                await clearSession();
                                await clearCredentials();
                                logout();
                            });
                        }}
                    />
                    <Text
                        variant="caption"
                        color={"content_1"}
                        style={{
                            opacity: 0.5,
                            marginVertical: theme.spacing.$10,
                        }}
                    >
                        1.9.3 (Main)
                    </Text>
                </YStack>
            </ScrollView>
        </ModalScreen>
    );
}
