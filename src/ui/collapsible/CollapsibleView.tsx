import React, { useState } from "react";
import theme from "../theme/theme";
import Collapsible from "react-native-collapsible";
import { XStack, YStack } from "../stack";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { Text } from "../text";
import { IconButton } from "../button";
import { svgIcons } from "../../config/constants/iconSvgs";
import { Clickable } from "../clickable";
import { BlurView } from "expo-blur";
import SvgIcon from "../icon/SvgIcon";

export interface CollapsibleProps {
    headerTitle: string;
    headerIcon?: string;
    headerCount?: string | number;
    children: React.ReactNode;
    isBlur?: boolean;
}

export function CollapsibleView({
    headerTitle,
    headerIcon,
    headerCount,
    children,
    isBlur = true,
}: CollapsibleProps) {
    const styles = StyleSheet.create({
        imageDp: {
            width: theme.spacing.$8,
            height: theme.spacing.$8,
            borderRadius: theme.spacing.$4,
            position: "relative",
        },
        imageView: {
            marginLeft: theme.spacing.$1,
        },
        blurView: {
            width: theme.dimensions.fullWidth * 0.95,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            overflow: "hidden",
            paddingVertical: theme.spacing.$2,
        },
    });
    const [collapsed, setCollapsed] = useState<boolean>(true);

    return (
        <YStack
            alignItems="center"
            justifyContent="center"
            width={theme.dimensions.fullWidth}
        >
            <Clickable
                trackingName=""
                onPress={() => {
                    setCollapsed(!collapsed);
                }}
            >
                <XStack
                    alignItems="center"
                    justifyContent="center"
                    width={theme.dimensions.fullWidth}
                >
                    <BlurView
                        intensity={isBlur ? 5 : 0}
                        style={styles.blurView}
                    >
                        <XStack
                            alignItems="center"
                            justifyContent="space-between"
                            width={theme.dimensions.fullWidth * 0.9}
                        >
                            <XStack
                                alignItems="center"
                                justifyContent="center"
                                width={null}
                            >
                                {headerIcon && (
                                    <Image
                                        style={styles.imageDp}
                                        source={headerIcon}
                                        contentFit="cover"
                                        transition={1000}
                                    />
                                )}

                                <Text
                                    variant={"heading_small"}
                                    color={"content_primary"}
                                    style={{ marginLeft: theme.spacing.$2 }}
                                >
                                    {headerTitle}
                                </Text>
                            </XStack>

                            <XStack
                                alignItems="center"
                                justifyContent="flex-end"
                                width={null}
                            >
                                {headerCount && (
                                    <Text
                                        variant={"heading_small"}
                                        color={"content_primary"}
                                    >
                                        {headerCount}
                                    </Text>
                                )}

                                <View
                                    style={[
                                        styles.imageView,
                                        {
                                            transform: [
                                                {
                                                    rotate: !collapsed
                                                        ? "270deg"
                                                        : "90deg",
                                                },
                                            ],
                                        },
                                    ]}
                                >
                                    <SvgIcon
                                        trackingName="" // not clickable so no need to track
                                        notClickable={true}
                                        svgOfIcon={svgIcons.goForward}
                                        size={30}
                                        iconColor={theme.colors.content_primary}
                                    />
                                </View>
                            </XStack>
                        </XStack>
                    </BlurView>
                </XStack>
            </Clickable>

            <Collapsible
                collapsed={collapsed}
                style={{ width: theme.dimensions.fullWidth * 0.9 }}
            >
                {children}
            </Collapsible>
        </YStack>
    );
}

export default CollapsibleView;
