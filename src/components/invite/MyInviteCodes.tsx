import { PUBLIC_APP_NAME } from "@env";
import * as Burnt from "burnt";
import * as Clipboard from "expo-clipboard";
import { useState } from "react";
import { Platform, Share } from "react-native";
import Collapsible from "react-native-collapsible";
import { svgIcons } from "../../config/constants/iconSvgs";
import { segmentClient } from "../../config/segmentClient";
import { useInviteCodesState } from "../../state/inviteCodesState";
import { IconButton, Text, theme } from "../../ui";
import { Card } from "../../ui/card";
import SvgIcon from "../../ui/icon/SvgIcon";
import { XStack, YStack } from "../../ui/stack";

export function InviteCodeCard(props: {
    inviteCode: string;
    expired: boolean;
    usedBy: string | null;
}) {
    const handleCopy = () => {
        if (props.expired || props.usedBy !== null) {
            Burnt.toast({
                title: "code expired",
                preset: "error",
                message: "",
            });
        }
        Clipboard.setStringAsync(props.inviteCode);
        Burnt.toast({
            title: "copied code",
            preset: "done",
            message: "",
        });
    };

    return (
        <XStack
            justifyContent={"space-between"}
            alignItems={"center"}
            width={"100%"}
            style={{
                marginVertical: theme.spacing.$2,
                width: "85%",
            }}
        >
            <Card
                trackingName="Invite Code Copied"
                cardParentStyle={{
                    width: theme.dimensions.fullWidth * 0.5,
                    paddingVertical: theme.spacing.$4,
                }}
                color={theme.colors.content_primary + "05"}
                blur={true}
                borderRadius={theme.spacing.$3}
                onPress={handleCopy}
            >
                <XStack
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={"100%"}
                    gap={theme.spacing.$2}
                >
                    <Text variant="button_large" color={"content_primary"}>
                        {props.inviteCode}
                    </Text>
                    <SvgIcon
                        svgOfIcon={svgIcons.handleCopy}
                        size={30}
                        iconColor={theme.colors.content_primary}
                        notClickable={true}
                        trackingName="" // empty because icon is not clickable
                    />
                </XStack>
            </Card>
            <IconButton
                trackingName="Share Invite Code Clicked"
                onPress={() => {
                    const shareUrl = `https://share.dappstore.app/?invited=${props.inviteCode}`;
                    segmentClient.track("Share App Action", {
                        withInviteCode: true,
                        source: "Invite Screen or Special Card",
                    });
                    Share.share({
                        message:
                            Platform.OS === "android"
                                ? `Explore ${PUBLIC_APP_NAME}: Where AI-driven recommendations meet exclusive Web3 apps. Earn points and enjoy privacy-first discovery! Join me now ${shareUrl}`
                                : `Explore ${PUBLIC_APP_NAME}: Where AI-driven recommendations meet exclusive Web3 apps. Earn points and enjoy privacy-first discovery! Join me now`,
                        url: shareUrl,
                        title: PUBLIC_APP_NAME,
                    });
                }}
                icon={svgIcons.share}
                buttonColor={theme.colors.brand_green_secondary}
                labelColor={theme.colors.base_secondary}
                disabled={props.expired || props.usedBy !== null}
                size={65}
            />
        </XStack>
    );
}

export default function MyInviteCodes() {
    const codes = useInviteCodesState().inviteCodes.inviteCodes;

    const [hideInviteCodes, setHideInviteCodes] = useState<boolean>(true);

    if (!codes || codes.length === 0) {
        return (
            <YStack
                justifyContent={"flex-start"}
                alignItems={"center"}
                width={null}
                gap={theme.spacing.$2}
                style={{
                    marginVertical: theme.spacing.$4,
                }}
            >
                <Text variant="body_small" color={"content_1"}>
                    No invite codes yet!
                </Text>
            </YStack>
        );
    }

    return (
        <YStack
            justifyContent={"flex-start"}
            alignItems={"center"}
            width={"100%"}
            gap={theme.spacing.$2}
            style={{
                marginVertical: theme.spacing.$4,
            }}
        >
            <Card
                trackingName="Successfully Invited Card Clicked"
                cardParentStyle={{
                    width: theme.dimensions.fullWidth * 0.9,
                }}
                color={theme.colors.content_primary + "05"}
                blur={true}
                borderRadius={theme.spacing.$3}
            >
                <XStack
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    width={theme.dimensions.fullWidth * 0.9}
                    style={{ padding: theme.spacing.$4 }}
                >
                    <YStack
                        gap={theme.spacing.$2}
                        justifyContent={"center"}
                        alignItems={"flex-start"}
                        width={theme.dimensions.fullWidth * 0.65}
                    >
                        <Text variant="heading_small" color={"content_1"}>
                            successfully invited
                        </Text>
                        <Text
                            variant="caption"
                            color={"content_1"}
                            style={{
                                opacity: 0.75,
                            }}
                        >
                            you will soon start earning a share of points from
                            your invitee's activities!
                        </Text>
                    </YStack>

                    <Text variant="heading_large" color={"color_3"}>
                        {
                            codes.filter((inviteCode) => inviteCode.expired)
                                .length
                        }
                    </Text>
                </XStack>
            </Card>

            <Card
                trackingName={"Show Invite Codes Clicked"}
                cardParentStyle={{
                    width: theme.dimensions.fullWidth * 0.9,
                    paddingVertical: theme.spacing.$5,
                    paddingHorizontal: theme.spacing.$4,
                    alignItems: "center",
                }}
                color={theme.colors.content_primary + "05"}
                blur={true}
                onPress={() => {
                    setHideInviteCodes((current) => !current);
                }}
            >
                {codes.length > 0 ? (
                    <XStack
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        width={"100%"}
                    >
                        <Text variant="heading_small" color={"content_1"}>
                            invite codes
                        </Text>
                        <SvgIcon
                            notClickable={true}
                            svgOfIcon={
                                hideInviteCodes
                                    ? svgIcons.arrowRight
                                    : svgIcons.chevronUp
                            }
                            size={30}
                            iconColor={theme.colors.content_primary}
                            trackingName="" // empty because icon is not clickable
                        />
                    </XStack>
                ) : (
                    <Text
                        variant="body_post_content_bold"
                        color="content_primary"
                    >
                        No Invite Codes
                    </Text>
                )}
            </Card>

            <Collapsible
                collapsed={hideInviteCodes}
                style={{
                    width: theme.dimensions.fullWidth * 0.9,
                    alignItems: "center",
                }}
            >
                {codes
                    .filter((inviteCode) => !inviteCode.expired)
                    .map((inviteCode, index) => (
                        <InviteCodeCard
                            key={index}
                            inviteCode={inviteCode.code}
                            expired={inviteCode.expired ?? false}
                            usedBy={inviteCode.used_by ?? null}
                        />
                    ))}
            </Collapsible>

            <Text
                variant="body_small"
                color={"content_1"}
                style={{
                    opacity: 0.5,
                    marginVertical: theme.spacing.$4,
                    textAlign: "center",
                }}
            >
                {`Contact us on Twitter, Telegram or anywhere else to get more codes!`}
            </Text>
        </YStack>
    );
}
