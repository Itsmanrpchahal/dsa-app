import * as Updates from "expo-updates";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useHomeStackNavigation } from "../navigation/types";
import { Text, TextButton, theme } from "../ui";
import { ModalScreen } from "../ui/screens";
import { YStack } from "../ui/stack";
import { Image } from "expo-image";
import { images } from "../config/constants/images";

export default function NewUpdate() {
    const styles = StyleSheet.create({
        blur_view: {
            flex: 1,
            alignItems: "center",
        },
    });

    const navigation = useHomeStackNavigation();

    const [status, setStatus] = useState<
        "checking" | "new-update" | "no-update" | "error"
    >("checking");

    const [updateDetails, setUpdateDetails] = useState<string>("");

    async function onFetchUpdateAsync() {
        try {
            const update = await Updates.checkForUpdateAsync();

            if (update.isAvailable) {
                setStatus("new-update");
                setUpdateDetails(update.manifest?.id ?? "");

                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();
            } else {
                setStatus("no-update");

                setUpdateDetails("");
            }
        } catch (error) {
            // You can also add an alert() to see the error message in case of an error when fetching updates.
            setStatus("error");
        }
    }

    useEffect(() => {
        onFetchUpdateAsync();
    }, []);

    return (
        <ModalScreen
            style={styles.blur_view}
            trackingName={"New Update Screen"}
        >
            <YStack
                gap={theme.spacing.$2}
                width="100%"
                justifyContent="center"
                alignItems="center"
                style={{
                    flex: 1,
                    paddingHorizontal: theme.spacing.$4,
                }}
            >
                <Text
                    variant="body_large_italic"
                    color="color_3"
                    style={{
                        textAlign: "center",
                    }}
                >
                    {status}
                </Text>
                <Text
                    variant="body_large_italic"
                    color="content_1"
                    style={{
                        textAlign: "center",
                    }}
                >
                    {updateDetails}
                </Text>
                {status === "new-update" && (
                    <YStack
                        justifyContent={"center"}
                        alignItems={"center"}
                        width={"100%"}
                        gap={theme.spacing.$8}
                    >
                        <Image
                            style={{
                                width: 100,
                                height: 100,
                            }}
                            source={images.updateFeatureIcon}
                            contentFit="cover"
                            transition={1000}
                        />
                        <Text
                            variant="heading_small"
                            color="content_primary"
                            style={{
                                textAlign: "center",
                            }}
                        >
                            App update downloading
                        </Text>
                        <Text
                            variant="body_small"
                            color="content_primary"
                            style={{
                                textAlign: "center",
                            }}
                        >
                            Please wait until the download is completed. Do not
                            close the app
                        </Text>
                    </YStack>
                )}
                {status === "no-update" && (
                    <YStack
                        justifyContent={"center"}
                        alignItems={"center"}
                        width={"100%"}
                        gap={theme.spacing.$8}
                    >
                        <Image
                            style={{
                                width: 100,
                                height: 100,
                            }}
                            source={images.updateFeatureIcon}
                            contentFit="cover"
                            transition={1000}
                        />
                        <Text
                            variant="heading_small"
                            color="content_primary"
                            style={{
                                textAlign: "center",
                            }}
                        >
                            No Update
                        </Text>
                        <TextButton
                            trackingName="Go Home From Update Screen"
                            label="GO HOME"
                            buttonColor={theme.colors.base_tertiary}
                            labelColor={theme.colors.content_primary}
                            onPress={() => {
                                navigation.goBack();
                            }}
                            small={true}
                        />
                    </YStack>
                )}
            </YStack>
        </ModalScreen>
    );
}
