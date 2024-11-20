import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { svgIcons } from "../../config/constants/iconSvgs";
import { images } from "../../config/constants/images";
import { IconButton, Popup, Text, TextButton, theme } from "../../ui";
import { Card } from "../../ui/card";
import { CollapsibleView } from "../../ui/collapsible";
import { Divider } from "../../ui/divider";
import { ClickableSquircleImage, SquircleImage } from "../../ui/image";
import { PlainStackScreen } from "../../ui/screens";
import { YStack } from "../../ui/stack";
import { colors } from "../../ui/theme/colors";
import { log } from "../../config/logger";
import { Image } from "expo-image";
import { WalletBottomSheet } from "../../ui/bottomsheet/WalletBottomSheet";

function BottomSheetDemo() {
    const [openSheet, setOpenSheet] = useState<boolean>(false);

    return (
        <View>
            <TextButton
                label="show bottom sheet"
                buttonColor={theme.colors.base_1}
                labelColor={theme.colors.content_1}
                onPress={() => {
                    setOpenSheet(true);
                }}
                trackingName="UI Testing"
            />
            <WalletBottomSheet
                trackingName=""
                isVisible={openSheet}
                onBackdropPress={() => {
                    setOpenSheet(false);
                }}
            >
                <View
                    style={{
                        width: "100%",
                    }}
                >
                    <Text variant="body_large" color="content_1">
                        Bottom Sheet
                    </Text>
                </View>
            </WalletBottomSheet>
        </View>
    );
}

export default function UIScreen() {
    const styles = StyleSheet.create({
        layout_view: {
            flex: 1,
            paddingTop: theme.spacing.statusbar,
        },
    });

    const [showPoup, setShowPopup] = useState<boolean>(false);
    const [collapsed, setCollapsed] = useState<boolean>(true);

    return (
        <PlainStackScreen trackingName="UIScreen" style={styles.layout_view}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingVertical: theme.spacing.$10 }}
            >
                <YStack
                    gap={theme.spacing.$2}
                    width="100%"
                    justifyContent="flex-start"
                    alignItems="center"
                >
                    <Text variant="heading_large" color="content_3">
                        UI Bits
                    </Text>
                    <Text
                        variant="body_large_italic"
                        color="content_3"
                        style={{
                            textAlign: "center",
                        }}
                    >
                        here we show all ui components and their variations
                    </Text>
                    <Divider
                        orientation="horizontal"
                        color={colors.content_1}
                        opacity={0.5}
                        style={{
                            width: "80%",
                            marginVertical: theme.spacing.$2,
                        }}
                    />
                    <TextButton
                        label="show collapisble"
                        buttonColor={theme.colors.base_1}
                        labelColor={theme.colors.content_1}
                        onPress={() => setCollapsed(!collapsed)}
                        trackingName="UI Testing"
                    />
                    {collapsed && (
                        <CollapsibleView
                            headerTitle={"Collapsible Title"}
                            headerIcon={images.icon}
                        >
                            <YStack
                                justifyContent="center"
                                alignItems="flex-start"
                                width={null}
                                gap={theme.spacing.$2}
                                style={{
                                    marginLeft: theme.spacing.$2,
                                }}
                            >
                                <Image
                                    source={images.icon}
                                    style={{ height: 170, width: 170 }}
                                />
                            </YStack>
                        </CollapsibleView>
                    )}
                    <TextButton
                        label="show popup"
                        buttonColor={theme.colors.base_1}
                        labelColor={theme.colors.content_1}
                        onPress={() => setShowPopup(true)}
                        trackingName="UI Testing"
                    />
                    <TextButton
                        label="show popup (disabled)"
                        buttonColor={theme.colors.base_1}
                        labelColor={theme.colors.content_1}
                        onPress={() => setShowPopup(true)}
                        disabled={true}
                        trackingName="UI Testing"
                    />
                    <TextButton
                        label="see image on button"
                        buttonColor={theme.colors.base_1}
                        labelColor={theme.colors.content_1}
                        onPress={() => setShowPopup(true)}
                        image="https://i.postimg.cc/wTNTPwrF/sample-dp.webp"
                        trackingName="UI Testing"
                    />
                    <TextButton
                        label="TALK TO BOT"
                        buttonColor={theme.colors.base_1}
                        labelColor={theme.colors.content_1}
                        onPress={() => setShowPopup(true)}
                        icon={svgIcons.callIcon}
                        trackingName="UI Testing"
                    />
                    <BottomSheetDemo />
                    <Divider
                        orientation="horizontal"
                        color={colors.content_1}
                        opacity={0.5}
                        style={{
                            width: "80%",
                            marginVertical: theme.spacing.$2,
                        }}
                    />
                    <IconButton
                        icon={svgIcons.callIcon}
                        onPress={() => setShowPopup(true)}
                        buttonColor={theme.colors.base_1}
                        labelColor={theme.colors.content_1}
                        trackingName="UI Testing"
                    />
                    <IconButton
                        icon={svgIcons.callIcon}
                        onPress={() => setShowPopup(true)}
                        buttonColor={theme.colors.base_1}
                        labelColor={theme.colors.content_1}
                        disabled={true}
                        trackingName="UI Testing"
                    />
                    <Divider
                        orientation="horizontal"
                        color={colors.content_1}
                        opacity={0.5}
                        style={{
                            width: "80%",
                            marginVertical: theme.spacing.$2,
                        }}
                    />
                    <SquircleImage
                        source={
                            "https://images.unsplash.com/photo-1709833226150-8eaeb6f291d1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNDh8fHxlbnwwfHx8fHw%3D"
                        }
                        contentFit="cover"
                        width={170}
                        height={170}
                    />
                    <View
                        style={{
                            width: "100%",
                            height: 150,
                        }}
                    >
                        <SquircleImage
                            source={
                                "https://images.unsplash.com/photo-1709833226150-8eaeb6f291d1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNDh8fHxlbnwwfHx8fHw%3D"
                            }
                            contentFit="cover"
                            width="100%"
                            height="100%"
                        />
                    </View>
                    <ClickableSquircleImage
                        source={
                            "https://images.unsplash.com/photo-1709833226150-8eaeb6f291d1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNDh8fHxlbnwwfHx8fHw%3D"
                        }
                        contentFit="cover"
                        width={170}
                        height={170}
                        trackingName={""}
                        onPress={() => {
                            log.debug("clicked on squircleimage");
                        }}
                    />
                    <Divider
                        orientation="horizontal"
                        color={colors.content_1}
                        opacity={0.5}
                        style={{
                            width: "80%",
                            marginVertical: theme.spacing.$2,
                        }}
                    />
                    <Card
                        color={theme.colors.base_1}
                        onPress={() => setShowPopup(true)}
                        trackingName={""}
                    >
                        <View style={{ padding: theme.spacing.$2 }}>
                            <Text variant="body_large" color="content_1">
                                Effective accelerationism (e/acc) is a
                                {/* philosophical movement that advocates for the */}
                                acceleration of technological progress, with a
                                particular focus on artificial general
                                intelligence (AGI). E/acc proponents believe
                                that AGI has the potential to usher in a new era
                                of peace, prosperity, and human flourishing, and
                                that we should do everything we can to
                                accelerate its development.
                            </Text>
                        </View>
                    </Card>
                    <Card trackingName={""}>
                        <View style={{ padding: theme.spacing.$2 }}>
                            <Text variant="body_large" color="content_1">
                                Effective accelerationism (e/acc) is a
                                philosophical movement that advocates for the
                                acceleration of technological progress, with a
                                particular focus on artificial general
                                intelligence (AGI). E/acc proponents believe
                                that AGI has the potential to usher in a new era
                                of peace, prosperity, and human flourishing, and
                                that we should do everything we can to
                                accelerate its development.
                            </Text>
                        </View>
                    </Card>
                    <Card
                        trackingName={""}
                        color={theme.colors.base_1}
                        onPress={() => setShowPopup(true)}
                    >
                        <View style={{ padding: theme.spacing.$2 }}>
                            <Text variant="body_large" color="content_1">
                                Card
                            </Text>
                        </View>
                    </Card>
                </YStack>
            </ScrollView>
            <Popup
                isVisible={showPoup}
                closePopup={() => setShowPopup(false)}
                height="short"
            >
                <Text
                    variant="body_large_italic"
                    color="content_3"
                    style={{
                        textAlign: "center",
                    }}
                >
                    some cute lines to show in the popup
                </Text>
            </Popup>
        </PlainStackScreen>
    );
}
