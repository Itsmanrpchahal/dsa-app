import { svgIcons } from "../../../config/constants/iconSvgs";
import { Text, theme } from "../../../ui";
import SvgIcon from "../../../ui/icon/SvgIcon";
import { XStack, YStack } from "../../../ui/stack";
import { useUserState } from "../../../state/userState";
import * as Clipboard from "expo-clipboard";
import * as Burnt from "burnt";
import { Clickable } from "../../../ui/clickable";
import { useTokenBalancesState } from "../../../state/tokenBalanceState";

export default function BasicWalletDetails() {
    const userName = useUserState.getState().userDetails?.name ?? "";
    const publicEvmAddress =
        useUserState.getState().userDetails?.publicEvmAddress ?? "";
    const totalBalanceUsd = useTokenBalancesState.getState().tokenBalances.totalBalanceUsd;
    const truncatedAddress = `${publicEvmAddress?.substring(
        0,
        10
    )}...${publicEvmAddress?.substring(publicEvmAddress?.length - 5)}`;

    return (
        <YStack
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            width={"100%"}
            gap={theme.spacing.$4}
            style={{
                marginHorizontal: theme.spacing.$7,
                marginBottom: theme.spacing.$8,
            }}
        >
            <SvgIcon
                svgOfIcon={svgIcons.vaultIcon}
                size={50}
                iconColor={theme.colors.content_1}
                notClickable={true}
                trackingName="" // empty because icon is not clickable
            />
            <XStack
                justifyContent={"center"}
                alignItems={"center"}
                width={null}
                gap={theme.spacing.$2}
            >
                <Text variant="body_post_content_bold" color="content_primary">
                    {userName}
                </Text>
                <Clickable
                    trackingName="Copied Wallet Address to Clipboard In Wallet Screen"
                    onPress={() => {
                        Clipboard.setStringAsync(publicEvmAddress);
                        Burnt.toast({
                            title: "copied code",
                            preset: "done",
                            message: "",
                        });
                    }}
                >
                    <XStack
                        justifyContent={"center"}
                        alignItems={"center"}
                        width={null}
                        gap={theme.spacing.$1}
                        style={{ opacity: 0.5 }}
                    >
                        <Text
                            variant="body_post_content_bold"
                            color="content_primary"
                        >
                            {truncatedAddress}
                        </Text>
                        <SvgIcon
                            svgOfIcon={svgIcons.copyText}
                            size={20}
                            iconColor={theme.colors.content_1}
                            notClickable={true}
                            trackingName="" // empty because icon is not clickable
                        />
                    </XStack>
                </Clickable>
            </XStack>
            <Text variant="heading_large" color="content_primary">
                ${totalBalanceUsd?.toFixed(2) ?? "0.00"}
            </Text>
        </YStack>
    );
}
