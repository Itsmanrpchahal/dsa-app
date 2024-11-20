import { Image, ImageContentFit, ImageProps } from "expo-image";
import { Clickable, ClickableProps } from "../clickable";
import MaskedView from "@react-native-masked-view/masked-view";
import theme from "../theme/theme";
import { SquircleView } from "react-native-figma-squircle";
import { DimensionValue } from "react-native";

export type ClickableSquirleImageProps = SquircleImageBaseComponentProps & {
    onPress: ClickableProps["onPress"];
    trackingName: string;
    disabled?: boolean;
};
export type SquircleImageProps = SquircleImageBaseComponentProps;

export function SquircleImage({ ...props }: SquircleImageProps) {
    return <SquircleImageBaseComponent {...props} />;
}

export function ClickableSquircleImage({
    ...props
}: ClickableSquirleImageProps) {
    return (
        <Clickable
            onPress={props.onPress}
            trackingName={props.trackingName}
            disabled={props.disabled}
        >
            <SquircleImageBaseComponent {...props} />
        </Clickable>
    );
}

type SquircleImageBaseComponentProps = ImageProps & {
    source: string;
    contentFit: ImageContentFit;
    cornerRadius?: number;
    width?: DimensionValue;
    height?: DimensionValue;
};

export function SquircleImageBaseComponent({
    source,
    contentFit,
    cornerRadius,
    width,
    height,
    ...props
}: SquircleImageBaseComponentProps) {
    return (
        <MaskedView
            maskElement={
                <SquircleView
                    squircleParams={{
                        cornerSmoothing: 1,
                        cornerRadius: cornerRadius ?? theme.spacing.$5,
                        fillColor: theme.colors.base_primary,
                    }}
                    style={{
                        flex: 1,
                    }}
                />
            }
        >
            <Image
                source={source}
                contentFit={contentFit}
                style={[
                    {
                        width,
                        height,
                    },
                    props.style,
                ]}
                {...props}
            />
        </MaskedView>
    );
}
