import { PUBLIC_APP_NAME } from "@env";
import { Image } from "expo-image";
import * as Updates from "expo-updates";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { HOME_HEADER_HEIGHT } from "../../config/constants/dimensions";
import { images } from "../../config/constants/images";
import { useHomeStackNavigation } from "../../navigation/types";
import { Text, theme } from "../../ui";
import { Clickable } from "../../ui/clickable";
import { XStack } from "../../ui/stack";

const pfps = [
    require("../../../assets/pfp-1.png"),
    require("../../../assets/pfp-2.png"),
    require("../../../assets/pfp-3.png"),
    require("../../../assets/pfp-4.png"),
    require("../../../assets/pfp-5.png"),
    require("../../../assets/pfp-6.png"),
    require("../../../assets/pfp-7.png"),
];

function AppBranding() {
    const navigation = useHomeStackNavigation();

    async function onFetchUpdateAsync() {
        try {
            const update = await Updates.checkForUpdateAsync();
            if (update.isAvailable) {
                navigation.navigate("NewUpdate");
            }
        } catch (error) {
            console.log("error checking for updates");
        }
    }

    useEffect(() => {
        onFetchUpdateAsync();
    }, []);

    return (
        <>
            <Clickable
                trackingName="App Name In Header Clicked"
                onPress={() => {
                    onFetchUpdateAsync();
                }}
            >
                <XStack
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={null}
                    gap={theme.spacing.$1}
                >
                    <Image
                        source={images.rocketLogo}
                        style={{
                            width: theme.spacing.$5,
                            height: theme.spacing.$5,
                        }}
                        contentFit="contain"
                    />
                    <Text variant="heading_small_italic" color="light">
                        {PUBLIC_APP_NAME}
                    </Text>
                </XStack>
            </Clickable>
        </>
    );
}

function Invite() {
    const navigation = useHomeStackNavigation();
    return (
        <Clickable
            trackingName="Invite Icon In Header Clicked"
            onPress={() => {
                navigation.navigate("InviteScreen");
            }}
        >
            <Image
                style={{ width: 33, height: 33 }}
                source={images.inviteFeatureIcon}
            />
        </Clickable>
    );
}

function Points() {
    const navigation = useHomeStackNavigation();
    return (
        <Clickable
            trackingName="Points Icon In Header Clicked"
            onPress={() => {
                navigation.navigate("PointsScreen");
            }}
        >
            <Image
                style={{ width: 33, height: 33 }}
                source={images.pointsFeatureIcon}
            />
        </Clickable>
    );
}

function Profile() {
    const navigation = useHomeStackNavigation();

    const styles = StyleSheet.create({
        image: {
            width: 23,
            height: 33,
        },
    });

    const [pfp, setPfp] = useState<any>(1);

    useEffect(() => {
        const pfpNumber: number = Math.floor(Math.random() * 7) + 1;

        setPfp(pfpNumber);
    }, []);

    return (
        <Clickable
            trackingName="Profile Icon In Header Clicked"
            onPress={() => {
                navigation.navigate("Profile", {
                    displayPicture: pfps[pfp - 1],
                });
            }}
        >
            <Image
                style={styles.image}
                source={images.profileHeaderMaleIcon}
                contentFit="cover"
                transition={1000}
            />
        </Clickable>
    );
}

export function HomeHeader() {
    const styles = StyleSheet.create({
        parent_view: {
            width: theme.dimensions.fullWidth,
            height: HOME_HEADER_HEIGHT,
            position: "absolute",
            top: 0,
            zIndex: 5,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: theme.spacing.$4,
            paddingBottom: theme.spacing.$2,
            paddingTop: theme.spacing.statusbar + theme.spacing.$2,
        },

        right_side_view: {
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.$3,
        },
    });

    return (
        <View style={styles.parent_view}>
            <AppBranding />
            {/* <>
				<Text variant="caption_italic" color="light">
					{todayUsage.todayUsage.postsRead}
				</Text>
			</> */}
            <View style={styles.right_side_view}>
                <Invite />
                <Points />
                <Profile />
            </View>
        </View>
    );
}
