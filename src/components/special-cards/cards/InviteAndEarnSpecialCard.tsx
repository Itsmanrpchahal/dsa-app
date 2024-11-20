import { PUBLIC_APP_NAME } from "@env";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Image } from "expo-image";
import { useEffect } from "react";
import { Platform, View } from "react-native";
import { SquircleView } from "react-native-figma-squircle";
import { HOME_HEADER_HEIGHT } from "../../../config/constants/dimensions";
import { responsiveScreenFontSize } from "../../../config/constants/responsiveCalculations";
import { segmentClient } from "../../../config/segmentClient";
import { useInviteCodesState } from "../../../state/inviteCodesState";
import { Text, theme } from "../../../ui";
import { YStack } from "../../../ui/stack";
import { InviteCodeCard } from "../../invite/MyInviteCodes";
import { images } from "../../../config/constants/images";

const SpecialCardBody = () => {
    const codes = useInviteCodesState().inviteCodes.inviteCodes;

    return (
        <YStack
            justifyContent={"center"}
            alignItems={"center"}
            width={"auto"}
            style={{
                flex: 1,
                padding: theme.spacing.$4,
                justifyContent: "space-between",
            }}
        >
            <Image
                style={{
                    width:
                        Platform.OS === "ios"
                            ? 180
                            : responsiveScreenFontSize(20),
                    height:
                        Platform.OS === "ios"
                            ? 180
                            : responsiveScreenFontSize(20),
                }}
                source={images.inviteMessageIcon}
            />
            <Text
                variant="heading_large_italic"
                color={"content_primary"}
                style={{
                    textAlign: "center",
                }}
            >
                Invite & Earn
            </Text>
            <Text
                variant="body_small"
                color={"content_primary"}
                style={{
                    opacity: 0.5,
                    textAlign: "center",
                }}
            >
                {`Invite your friends to ${PUBLIC_APP_NAME} and earn points for each friend who signs up! \n Bonus, you will earn a share of the points they earn.`}
            </Text>
            <Text
                variant="body_small"
                color={"content_primary"}
                style={{
                    opacity: 0.5,
                    textAlign: "center",
                }}
            >
                {`If you are liking the app, invite one friend now!`}
            </Text>
            {codes.filter((inviteCode) => !inviteCode.expired).slice(0, 1)
                .length > 0 ? (
                <>
                    {codes
                        .filter((inviteCode) => !inviteCode.expired)
                        .slice(0, 1)
                        .map((inviteCode, index) => (
                            <InviteCodeCard
                                key={index}
                                inviteCode={inviteCode.code}
                                expired={inviteCode.expired ?? false}
                                usedBy={inviteCode.used_by ?? null}
                            />
                        ))}
                </>
            ) : (
                <Text
                    variant="body_small"
                    color={"content_primary"}
                    style={{
                        opacity: 1,
                        marginVertical: theme.spacing.$4,
                        textAlign: "center",
                    }}
                >
                    {`Contact us on Twitter, Telegram or anywhere else to get more invite codes!`}
                </Text>
            )}
        </YStack>
    );
};

export const InviteAndEarnSpecialCard = () => {
    const tabBarHeight = useBottomTabBarHeight();
    const postPadding = theme.spacing.$10;
    const cardHeight =
        theme.dimensions.fullHeight -
        HOME_HEADER_HEIGHT -
        tabBarHeight -
        postPadding +
        20;

    useEffect(() => {
        // analytics
        segmentClient.track("Invite and Earn Special Card Viewed");
    }, []);

    return (
        <View style={{ flex: 1, height: theme.dimensions.fullHeight }}>
            <SquircleView
                squircleParams={{
                    cornerSmoothing: 1,
                    cornerRadius: theme.spacing.$5,
                    fillColor: theme.colors.base_primary + "50",
                }}
                style={{
                    width: theme.dimensions.fullWidth * 0.95,
                    marginTop: HOME_HEADER_HEIGHT,
                    marginBottom: postPadding / 2,
                    height: cardHeight,
                    alignSelf: "center",
                }}
            >
                <SpecialCardBody />
            </SquircleView>
        </View>
    );
};
