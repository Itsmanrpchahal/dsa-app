import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Modal, Image as RNImage, View } from "react-native";
import { IconButton, theme } from "../../ui";
import { svgIcons } from "../../config/constants/iconSvgs";
import { Clickable } from "../../ui/clickable";

export interface AppScreenshotsProps {
    appScreenshots: string[];
}

export function AppScreenshots({ appScreenshots }: AppScreenshotsProps) {
    const screenshotWidth = theme.dimensions.fullWidth * 0.8;
    const [screenshotHeight, setScreenshotHeight] = useState<number>(0);

    useEffect(() => {
        RNImage.getSize(appScreenshots[0] ?? "", (width, height) => {
            const ratio = width / height;
            setScreenshotHeight(screenshotWidth / ratio);
        });
    }, [appScreenshots]);

    return (
        <View
            style={{
                width: theme.dimensions.fullWidth,
                height: screenshotHeight,
                flexDirection: "row",
                marginTop: theme.spacing.$3,
            }}
        >
            <CustomImageList
                images={appScreenshots}
                imageWidth={screenshotWidth}
                imageHeight={screenshotHeight}
            />
        </View>
    );
}

interface CustomImageListProps {
    images: string[];
    imageWidth: number;
    imageHeight: number;
}

function CustomImageList({
    images,
    imageWidth,
    imageHeight,
}: CustomImageListProps) {
    const [viewScreenshots, setViewScreenshots] = useState<boolean>(false);

    return (
        <>
            <FlashList
                data={images}
                renderItem={({ index, item }) => (
                    <Clickable
                        trackingName="View Screenshots in Detail"
                        onPress={() => {
                            // action
                            setViewScreenshots(true);
                        }}
                    >
                        <Image
                            style={{
                                width: imageWidth,
                                height: imageHeight,
                                borderRadius: theme.spacing.$4,
                                marginLeft: theme.spacing.$2,
                            }}
                            key={index}
                            source={item ?? ""}
                            contentFit="cover"
                            transition={1000}
                        />
                    </Clickable>
                )}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                estimatedItemSize={imageWidth}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={viewScreenshots}
                onRequestClose={() => {
                    setViewScreenshots(false);
                }}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: theme.colors.base_3,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <View
                        style={{
                            flex: 0.9,
                            paddingTop: theme.spacing.$3,
                        }}
                    >
                        <FlashList
                            data={images}
                            renderItem={({ index, item }) => (
                                <Image
                                    style={{
                                        width: imageWidth,
                                        height: imageHeight,
                                        borderRadius: theme.spacing.$2,
                                        marginLeft: theme.spacing.$2,
                                    }}
                                    key={index}
                                    source={item ?? ""}
                                    contentFit="cover"
                                    transition={1000}
                                />
                            )}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            estimatedItemSize={imageWidth}
                        />
                    </View>
                    <IconButton
                        icon={svgIcons.close}
                        onPress={() => {
                            setViewScreenshots(false);
                        }}
                        trackingName="Close Detailed View Of Screenshots In App Screen"
                        buttonColor={theme.colors.base_1}
                        labelColor={theme.colors.content_1}
                    />
                </View>
                
            </Modal>
        </>
    );
}
