import { useState } from "react";
import { SvgXml } from "react-native-svg";
import { Text, theme } from "../../../../ui";
import { ZStack } from "../../../../ui/stack";
import { Linking, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import registerAction, {
    ActionType,
} from "../../../../helpers/feed/misc/registerAction";
import { useUserState } from "../../../../state/userState";

export interface PostTitleProps {
    external_url: string;
    title: string;
    postId?: string;
    bodyHeight?: number;
}

export default function PostTitle({
    external_url,
    title,
    postId,
    bodyHeight,
}: PostTitleProps) {
    const [textWidth, setTextWidth] = useState(0);

    const svgBrushStrokeTop = `
<svg height="50" viewBox="0 0 ${textWidth} 50" xmlns="http://www.w3.org/2000/svg">
<path d="M 5 25 Q 150 17 295 25 T 590 25" stroke="#D7450E" stroke-width="50" fill="none"/>
</svg>
`;

    const svgBrushStrokeBottom = `
<svg height="50" viewBox="0 0 ${textWidth} 50" xmlns="http://www.w3.org/2000/svg">
<path d="M 5 25 Q 150 17 295 25 T 590 25" stroke="#C27500" stroke-width="50" fill="none"/>
</svg>
`;

    const handleClick = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        external_url &&
            registerAction({
                action: ActionType.SOURCE_LINK_VISIT,
                postId: postId ?? "",
                uuid: useUserState.getState().userDetails.uuid!,
            });

        external_url && Linking.openURL(external_url);
    };
    return (
        <ZStack
            width={null}
            height={50}
            style={{
                justifyContent: "center",
                marginTop: theme.spacing.$2,
            }}
        >
            <Text
                variant={
                    Platform.OS === "android"
                        ? (bodyHeight ?? 0) <= 500
                            ? "post_title_small"
                            : "post_title_large"
                        : (bodyHeight ?? 0) <= 400
                        ? "post_title_small"
                        : "post_title_large"
                }
                color="light"
                onPress={handleClick}
                onLayout={(event) => {
                    const { width } = event.nativeEvent.layout;
                    setTextWidth(width);
                }}
                style={{
                    position: "absolute",
                }}
            >
                {title}
            </Text>
        </ZStack>
    );
}
