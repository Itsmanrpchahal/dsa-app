import React, { useEffect, useState } from "react";
import { Platform, ScrollView } from "react-native";
import { getAppDetails } from "../../../../helpers/feed/api/getAppDetails";
import { Text, theme } from "../../../../ui";
import { XStack, YStack } from "../../../../ui/stack";
// @ts-ignore
import { APP_SUGGESTIONS_HEIGHT } from "../../../../config/constants/dimensions";
import { images } from "../../../../config/constants/images";
import { responsiveHeight } from "../../../../config/constants/responsiveCalculations";
import registerAction, {
    ActionType,
} from "../../../../helpers/feed/misc/registerAction";
import { useHomeStackNavigation } from "../../../../navigation/types";
import { Clickable } from "../../../../ui/clickable";
import { SquircleImage } from "../../../../ui/image";

const AppThumbnail = (props: {
    appId: string;
    itemId: string;
    uuid: string;
}) => {
    const navigation = useHomeStackNavigation();
    const [appDetails, setAppDetails] = useState<any>(null);

    useEffect(() => {
        async function appDetails() {
            const appDetails = await getAppDetails(props.appId);
            setAppDetails(appDetails[0]);
        }
        appDetails();
    }, [props.appId]);

    const openApp = () => {
        registerAction({
            action: ActionType.APP_VIEW,
            postId: props.itemId,
            uuid: props.uuid,
        });

        navigation.navigate("AppScreen", {
            appDetails: appDetails,
            source: "Post App Suggestions",
        });
    };

    const RenderCircularThumbnail = (props: {
        disabled: boolean;
        imageUrl: string;
        title: string;
        appId: string;
        postId: string;
    }) => {
        const screenHeight = theme.dimensions.fullHeight;

        const thumbnailImageSize =
            Platform.OS === "android"
                ? responsiveHeight(7.4)
                : screenHeight <= 700
                ? 40
                : 60;

        return (
            <Clickable
                disabled={props.disabled}
                onPress={() => openApp()}
                trackingName="App Suggestion For Post Clicked"
                trackingParameters={{
                    postId: props.postId,
                    appId: props.appId,
                }}
            >
                <YStack
                    justifyContent={"flex-start"}
                    alignItems={"center"}
                    width={null}
                    gap={theme.spacing.$1}
                >
                    <SquircleImage
                        style={{
                            width: thumbnailImageSize,
                            height: thumbnailImageSize,
                            backgroundColor: theme.colors.base_primary + "75",
                        }}
                        source={props.imageUrl}
                        contentFit="cover"
                        transition={1000}
                        cornerRadius={theme.spacing.$2}
                    />
                    <Text
                        variant="body_small"
                        color="light"
                        numberOfLines={2}
                        textAlign="center"
                        style={{
                            // max width is 50% of the app thumbnail width
                            width: thumbnailImageSize * 1.5,
                        }}
                    >
                        {props.title}
                    </Text>
                </YStack>
            </Clickable>
        );
    };

    if (appDetails === null) {
        return (
            <RenderCircularThumbnail
                imageUrl={images.icon}
                title={"loading"}
                disabled={true}
                appId=""
                postId={props.itemId}
            />
        );
    }

    if (
        appDetails?.images?.logo === undefined ||
        appDetails?.name === undefined
    ) {
        return null;
    }

    return (
        <RenderCircularThumbnail
            imageUrl={appDetails?.images?.logo}
            title={appDetails?.name}
            disabled={false}
            appId={appDetails?.id}
            postId={props.itemId}
        />
    );
};

export interface AppSuggestionsProps {
    appsIds: string[];
    itemId: string;
    uuid: string;
}

function AppSuggestions({ appsIds, itemId, uuid }: AppSuggestionsProps) {
    return (
        <XStack
            justifyContent={"center"}
            alignItems={"center"}
            width={null}
            style={{
                height: APP_SUGGESTIONS_HEIGHT,
            }}
        >
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    gap: theme.spacing.$5,
                }}
            >
                {appsIds.map((appId, index) => (
                    <AppThumbnail
                        appId={appId}
                        key={index}
                        itemId={itemId}
                        uuid={uuid}
                    />
                ))}
            </ScrollView>
        </XStack>
    );
}

export default React.memo(AppSuggestions);
