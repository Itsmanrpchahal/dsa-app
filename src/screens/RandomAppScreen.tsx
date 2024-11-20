import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { segmentClient } from "../config/segmentClient";
import { Text, theme } from "../ui";
import { ModalScreen } from "../ui/screens";
import { YStack } from "../ui/stack";

export default function RandomAppScreen() {
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

    // analytics
    useEffect(() => {
        segmentClient.screen("Random App Screen");
    }, []);

    return (
        <ModalScreen style={styles.blur_view} trackingName="Random App Screen">
            <YStack
                justifyContent={"center"}
                alignItems={"center"}
                width={null}
                gap={70}
                style={{
                    marginVertical: theme.spacing.$4,
                    flex: 1,
                }}
            >
                <Text
                    variant="body_large"
                    color={"content_1"}
                    style={{
                        marginHorizontal: theme.spacing.$4,
                    }}
                >
                    today's feed is complete, please check back later!
                </Text>
            </YStack>
        </ModalScreen>
    );
}
