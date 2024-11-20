import { PUBLIC_APP_NAME } from "@env";
import { Text, theme } from "../../../ui";
import { WalletBottomSheet } from "../../../ui/bottomsheet/WalletBottomSheet";
import { Card } from "../../../ui/card";
import { YStack } from "../../../ui/stack";
import { useHomeStackNavigation } from "../../../navigation/types";

interface WalletZeroStartProps {
    showWalletZeroStartSheet: boolean;
    setShowWalletZeroStartSheet: (showWalletZeroStartSheet: boolean) => void;
}

export default function WalletZeroStart({
    showWalletZeroStartSheet,
    setShowWalletZeroStartSheet,
}: WalletZeroStartProps) {
    const navigation = useHomeStackNavigation();

    return (
        <YStack
            justifyContent={"center"}
            alignItems={"center"}
            width={"100%"}
            gap={theme.spacing.$4}
            style={{ paddingVertical: theme.spacing.$4 }}
        >
            <Text variant="heading_small" color={"content_1"}>
                Fund your Wallet to get started
            </Text>
            <Card
                trackingName="Zero Start Wallet Desposit Card Clicked"
                cardParentStyle={{
                    width: theme.dimensions.fullWidth * 0.9,
                }}
                color={theme.colors.content_primary + "05"}
                blur={true}
                borderRadius={theme.spacing.$3}
                onPress={() => {
                    navigation.navigate("ReceiveIntoWalletScreen");
                }}
            >
                <YStack
                    gap={theme.spacing.$2}
                    justifyContent={"center"}
                    alignItems={"flex-start"}
                    width="100%"
                    style={{ padding: theme.spacing.$4 }}
                >
                    <Text variant="heading_small" color={"content_1"}>
                        Send some funds to your wallet to get started
                    </Text>
                    <Text
                        variant="caption"
                        color={"content_1"}
                        style={{
                            opacity: 0.75,
                        }}
                    >
                        Send some crypto from your existing wallets or exchanges
                        to {PUBLIC_APP_NAME}'s wallet address
                    </Text>
                </YStack>
            </Card>
            <Card
                trackingName="Zero Start Wallet Buy Crypto Card Clicked"
                cardParentStyle={{
                    width: theme.dimensions.fullWidth * 0.9,
                }}
                color={theme.colors.content_primary + "05"}
                blur={true}
                borderRadius={theme.spacing.$3}
                onPress={() => {
                    navigation.navigate("DepositIntoWalletScreen");
                    setShowWalletZeroStartSheet(false);
                }}
            >
                <YStack
                    gap={theme.spacing.$2}
                    justifyContent={"center"}
                    alignItems={"flex-start"}
                    width="100%"
                    style={{ padding: theme.spacing.$4 }}
                >
                    <Text variant="heading_small" color={"content_1"}>
                        Buy crypto via our partners
                    </Text>
                    <Text
                        variant="caption"
                        color={"content_1"}
                        style={{
                            opacity: 0.75,
                        }}
                    >
                        Buy crypto from our external partners easily and
                        securely. This takes you to a partner website.
                    </Text>
                </YStack>
            </Card>
        </YStack>
    );
}
