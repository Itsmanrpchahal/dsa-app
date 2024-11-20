import { MotiPressable } from "moti/interactions";
import { ComponentProps } from "react";
import { PressableProps } from "react-native";
import { SquircleView } from "react-native-figma-squircle";
import { Text, theme } from "../../../ui";
import { Clickable } from "../../../ui/clickable";
import SvgIcon from "../../../ui/icon/SvgIcon";
import { YStack } from "../../../ui/stack";

type MotiAnimationProps = ComponentProps<typeof MotiPressable>;

export type WalletControlButtonProps = MotiAnimationProps &
    PressableProps & {
        svgOfIcon: string;
        label: string;
        onClick: () => void;
        disabled?: boolean;
    };

const controlButtonColor = theme.colors.brand_green_tertiary;

export default function WalletControlButton({
    svgOfIcon,
    label,
    onClick,
    disabled,
}: WalletControlButtonProps) {
    return (
        <Clickable
            onPress={onClick}
            trackingName={`${label} on Wallet Screen Clicked`}
        >
            <YStack
                justifyContent={"center"}
                alignItems={"center"}
                width={null}
                gap={theme.spacing.$2}
            >
                <SquircleView
                    squircleParams={{
                        cornerSmoothing: 1,
                        cornerRadius: 15,
                        fillColor: controlButtonColor + "25",
                    }}
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: disabled ? 0.5 : 1,
                        width: 70,
                        height: 70,
                    }}
                >
                    <SvgIcon
                        svgOfIcon={svgOfIcon}
                        iconColor={controlButtonColor}
                        size={35}
                        notClickable={true}
                        trackingName="" // empty because icon is not clickable
                    />
                </SquircleView>
                <Text variant="body_small" color="content_1">
                    {label}
                </Text>
            </YStack>
        </Clickable>
    );
}
