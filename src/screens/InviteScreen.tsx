import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import InviteIntroComponent from "../components/invite/InviteIntroComponent";
import MyInviteCodes from "../components/invite/MyInviteCodes";
import useDailyActivityViewHideState from "../state/helpViewHideState";
import { theme } from "../ui";
import { ModalScreen } from "../ui/screens";
import { YStack } from "../ui/stack";

export default function InviteScreen() {
    const styles = StyleSheet.create({
        blur_view: {
            flex: 1,
            alignItems: "center",
        },
    });

    const { setDailyActivityViewHide } = useDailyActivityViewHideState();

    useEffect(() => {
        setDailyActivityViewHide(false);
    }, []);

    return (
        <ModalScreen
            trackingName="Invite Screen"
            style={styles.blur_view}
            title="Invite a Friend"
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                <YStack
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={"90%"}
                    gap={10}
                    style={{
                        marginVertical: theme.spacing.$4,
                        alignSelf: "center",
                    }}
                >
                    <InviteIntroComponent />
                    <MyInviteCodes />
                </YStack>
            </ScrollView>
        </ModalScreen>
    );
}
