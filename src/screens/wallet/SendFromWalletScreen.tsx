import { Text, theme } from "../../ui";
import { Card } from "../../ui/card";
import { ModalScreen } from "../../ui/screens";
import { YStack } from "../../ui/stack";

export default function SendFromWalletScreen() {
    return (
        <ModalScreen title="Send" trackingName={"Send From Wallet Screen"}>
            <YStack
                justifyContent={"center"}
                alignItems={"center"}
                width={"100%"}
                gap={theme.spacing.$8}
                style={{ flex: 1 }}
            >
                <Card
                    trackingName={"Send From Wallet Coming Soon Card Clicked"}
                    cardParentStyle={{
                        width: theme.dimensions.fullWidth * 0.9,
                        paddingVertical: theme.spacing.$5,
                        paddingHorizontal: theme.spacing.$4,
                        alignItems: "center",
                    }}
                    color={theme.colors.content_primary + "05"}
                    blur={true}
                >
                    <Text
                        variant="body_post_content_bold"
                        color="content_primary"
                    >
                        Coming Soon
                    </Text>
                </Card>
            </YStack>
        </ModalScreen>
    );
}
