import { StyleSheet } from "react-native";
import { XStack, YStack } from "../../../../ui/stack";
import { images } from "../../../../config/constants/images";
import { Text, TextButton, theme } from "../../../../ui";
import { useCurrentTabState } from "../../../../state/currentTabState";
import { useWalletActionState } from "../../../../state/walletActionState";
import { Image } from "expo-image";

const styles = StyleSheet.create({
    image: {
        width: 70,
        height: 70,
        marginBottom: theme.spacing.$3,
    },
    messsageText: {
        marginTop: theme.spacing.$6,
        marginBottom: theme.spacing.$4,
        width: theme.dimensions.fullWidth * 0.8,
    },
    hostName: {
        marginTop: theme.spacing.$6,
    },
    buttonsContainer: {
        marginTop: theme.spacing.$10,
    },
});

export const ConnectWalletSheet = ({ onConnect }: { onConnect: any }) => {
    const currentTabState = useCurrentTabState();
    const walletStateData =
        useWalletActionState.getState().walletAction.walletData;
    return (
        <YStack
            alignItems={"center"}
            justifyContent={"flex-start"}
            width={theme.dimensions.fullWidth * 0.9}
        >
            <Image
                style={styles.image}
                source={images.rocketLogo}
                contentFit="contain"
            ></Image>

            <Text variant="heading_small" color="content_primary">
                {currentTabState?.currentTab?.hostname}
            </Text>
            <Text
                variant="heading_small"
                color="content_primary"
                opacity={0.5}
                style={styles.messsageText}
                textAlign={"center"}
            >
                wants to connect to your dAppStore wallet
            </Text>

            <XStack
                alignItems={"center"}
                justifyContent={"space-around"}
                width={"100%"}
                style={styles.buttonsContainer}
            >
                <TextButton
                    trackingName="Connect Wallet Cancelled In Connect Wallet Sheet"
                    trackingParameters={{
                        hostname: currentTabState?.currentTab?.hostname,
                    }}
                    widthOfButton={theme.dimensions.fullWidth * 0.4}
                    onPress={() => {
                        onConnect(true);
                    }}
                    label={"Cancel"}
                    buttonColor={theme.colors.off_light}
                    labelColor={theme.colors.base_primary}
                />
                <TextButton
                    trackingName="Connect Wallet Confirmed In Connect Wallet Sheet"
                    trackingParameters={{
                        hostname: currentTabState?.currentTab?.hostname,
                    }}
                    widthOfButton={theme.dimensions.fullWidth * 0.4}
                    onPress={() => {
                        walletStateData?.onPositivePress();
                        onConnect(true);
                    }}
                    label={"Connect"}
                    buttonColor={theme.colors.brand_green_primary}
                    labelColor={theme.colors.base_primary}
                />
            </XStack>
        </YStack>
    );
};
