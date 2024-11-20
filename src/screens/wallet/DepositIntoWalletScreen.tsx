import { Text, theme } from "../../ui";
import { Card } from "../../ui/card";
import { ModalScreen } from "../../ui/screens";
import { XStack, YStack } from "../../ui/stack";
import * as Burnt from "burnt";

// content will be hard coded - as it changes rarely and later can be fetched from server
const CoinbasePayCard = () => {
    return (
        <Card
            trackingName={"Coinbase Pay Card Clicked"}
            cardParentStyle={{
                width: theme.dimensions.fullWidth * 0.9,
                padding: theme.spacing.$4,
            }}
            color={theme.colors.content_primary + "05"}
            blur={true}
            borderRadius={theme.spacing.$4}
            onPress={() => {
                Burnt.toast({
                    title: "coming soon!",
                    preset: "none",
                    message: "",
                });
            }}
        >
            <YStack
                justifyContent={"center"}
                alignItems={"flex-start"}
                width={"100%"}
                gap={theme.spacing.$3}
            >
                <Text variant="body_post_content_bold" color="content_primary">
                    Coinbase Pay
                </Text>
                <Text variant="body_small" color="content_primary">
                    Transfer from your coinbase account or using debit & credit
                    cards
                </Text>
                <XStack
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    width={"100%"}
                >
                    <Text
                        variant="body_small"
                        color="content_primary"
                        opacity={0.5}
                    >
                        Fees
                    </Text>
                    <Text variant="body_small" color="content_primary">
                        0.5% - 2.5%
                    </Text>
                </XStack>
            </YStack>
        </Card>
    );
};

const MoreOptionsCard = () => {
    return (
        <Card
            trackingName={"More Options Card Clicked"}
            cardParentStyle={{
                width: theme.dimensions.fullWidth * 0.9,
                paddingVertical: theme.spacing.$5,
                paddingHorizontal: theme.spacing.$4,
                alignItems: "center",
            }}
            color={theme.colors.content_primary + "05"}
            blur={true}
        >
            <Text variant="body_post_content_bold" color="content_primary">
                More Options Coming Soon
            </Text>
        </Card>
    );
};

const DisclaimerText = () => {
    return (
        <Text
            variant="body_small"
            color="content_primary"
            style={{
                width: theme.dimensions.fullWidth * 0.9,
                textAlign: "center",
            }}
        >
            This deposit redirects to a third-party service. We do not have any
            responsibility for this nor do we benefit from it in any way.
        </Text>
    );
};

export default function DepositIntoWalletScreen() {
    return (
        <ModalScreen
            title="Add Balance"
            trackingName={"Deposit Into Wallet Screen"}
        >
            <YStack
                justifyContent={"flex-start"}
                alignItems={"center"}
                width={"100%"}
                gap={theme.spacing.$8}
            >
                <CoinbasePayCard />
                <MoreOptionsCard />
                <DisclaimerText />
            </YStack>
        </ModalScreen>
    );
}
