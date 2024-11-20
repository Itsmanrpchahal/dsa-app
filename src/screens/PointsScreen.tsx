import { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import HowToEarn from "../components/points/HowToEarn";
import MyPoints from "../components/points/MyPoints";
import { segmentClient } from "../config/segmentClient";
import { theme } from "../ui";
import { ModalScreen } from "../ui/screens";
import { YStack } from "../ui/stack";
import useDailyActivityViewHideState from "../state/helpViewHideState";
import { log } from "../config/logger";

export default function PointsScreen() {
    const styles = StyleSheet.create({
        blur_view: {
            flex: 1,
            alignItems: "center",
        },
        calender: {
            width: theme.dimensions.fullWidth * 0.9,
            height: 350,
            backgroundColor: theme.colors.base_3 + "90",
            borderRadius: theme.spacing.$4,
            paddingVertical: theme.spacing.$4,
        },
        calender_theme: {
            backgroundColor: theme.colors.base_1 + "00",
        },
    });

    const { setDailyActivityViewHide } = useDailyActivityViewHideState();

    useEffect(() => {
        setDailyActivityViewHide(false);
    }, []);

    return (
        <ModalScreen
            trackingName="Points Screen"
            style={styles.blur_view}
            title=""
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                <YStack
                    justifyContent={"flex-start"}
                    alignItems={"center"}
                    width={null}
                    gap={theme.spacing.$10}
                    style={{
                        marginTop: theme.spacing.$4,
                        marginBottom: 100,
                    }}
                >
                    <MyPoints />
                    <HowToEarn />
                </YStack>
            </ScrollView>
        </ModalScreen>
    );
}
