import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "@shopify/restyle";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet, View } from "react-native";
import { useHomeStackNavigation } from "../../navigation/types";
import { IconButton, Text, theme } from "../../ui";
import { svgIcons } from "../../config/constants/iconSvgs";

interface AuthHeaderProps {
    navigationStack?: NativeStackNavigationProp<any>;
}

export function AuthHeader({ navigationStack }: AuthHeaderProps) {
    const styles = StyleSheet.create({
        parent_view: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: theme.dimensions.fullWidth,
            minHeight: 100,
            paddingHorizontal: theme.spacing.$4,
            paddingBottom: theme.spacing.$2,
            paddingTop: theme.spacing.statusbar + theme.spacing.$2,
        },
    });

    return (
        <View style={styles.parent_view}>
            {navigationStack && (
                <IconButton
                    trackingName=""
                    icon={svgIcons.iconBack}
                    onPress={() => {
                        navigationStack.goBack();
                    }}
                    buttonColor={theme.colors.base_1}
                    labelColor={theme.colors.content_1}
                />
            )}
        </View>
    );
}

export interface ModalHeaderProps {
    title: string;
    backToHome?: string;
}

export function ModalHeader({ title, backToHome }: ModalHeaderProps) {
    const theme = useTheme();
    const navigation = useHomeStackNavigation();

    const styles = StyleSheet.create({
        parent_view: {
            postion: "absolute",
            zIndex: 5,
            top: 0,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            elevation: 10, // adjust the elevation value to control the shadow effect
            shadowColor: "#171717", // shadow color should be a darker shade of the background color
            shadowOpacity: 0.5, // adjust the opacity value to control the shadow effect
            shadowRadius: 4, // adjust the radius value to control the shadow effect
            shadowOffset: { width: 0, height: 2 }, // adjust the offset values to control the shadow effect
        },
        blur_view: {
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: theme.dimensions.fullWidth,
            paddingHorizontal: theme.spacing.$4,
            paddingBottom: theme.spacing.$2,
            paddingTop: theme.spacing.statusbar + theme.spacing.$2,
        },
    });

    const PlatformSpecifcParent = (props: { children: React.ReactNode }) => {
        return (
            <View style={styles.parent_view}>
                {Platform.OS === "ios" ? ( // Check the platform and conditionally render BlurView for iOS
                    <BlurView
                        intensity={100}
                        style={styles.blur_view}
                        tint="dark"
                        blurReductionFactor={0.5}
                    >
                        {props.children}
                    </BlurView>
                ) : (
                    // For Android or other platforms, render the children without BlurView
                    <View style={styles.blur_view}>{props.children}</View>
                )}
            </View>
        );
    };

    return (
        <PlatformSpecifcParent>
            <Text variant="heading_small_italic" color="light">
                {title}
            </Text>
            <IconButton
                trackingName=""
                icon={svgIcons.close}
                onPress={() => {
                    if (backToHome) {
                        navigation.navigate("AppTabs");
                    } else {
                        navigation.goBack();
                    }
                }}
                buttonColor={theme.colors.base_1}
                labelColor={theme.colors.content_1}
            />
        </PlatformSpecifcParent>
    );
}
