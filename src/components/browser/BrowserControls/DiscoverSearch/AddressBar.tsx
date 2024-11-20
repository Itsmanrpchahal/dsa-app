import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, TextInput, View } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { WebView } from "react-native-webview";
import { BROWSER_INPUT_BAR_HEIGHT } from "../../../../config/constants/dimensions";
import { segmentClient } from "../../../../config/segmentClient";
import { processUrl } from "../../../../helpers/browser/misc/processUrl";
import { useCurrentTabState } from "../../../../state/currentTabState";
import { theme } from "../../../../ui";

interface AddressBarProps {
    webViewRef: React.RefObject<WebView>;
    searchData: (url: string) => void;
    bottomSheetRef: any;
    loading: boolean;
}

export default function AddressBar({
    webViewRef,
    searchData,
    bottomSheetRef,
    loading,
}: AddressBarProps) {
    const currentUrl = useCurrentTabState.getState().currentTab;
    const textInputRef = useRef<TextInput>(null);
    const [url, setUrl] = useState<string>(currentUrl?.url ?? "");
    const [isFocused, setIsFocused] = useState<boolean>(false);

    useEffect(() => {
        setUrl(currentUrl?.url ?? "");
    }, [currentUrl]);

    useEffect(() => {
        searchData(url);
    }, [url]);

    const handleUrl = (newUrl: string) => {
        const processedUrl = processUrl(newUrl);
        segmentClient.track("New Web App Typed & Requested", {
            url: processedUrl.url,
        });
        useCurrentTabState.getState().setCurrentTab(processedUrl);
    };

    // Update isFocused state on focus change
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(true);

    // swipe down gesture
    const swipeDownGesture = Gesture.Pan().onEnd((event) => {
        if (event.translationY > 0) {
            runOnJS(setIsFocused)(false);
        }
    });

    return (
        <View>
            {/* {!isFocused ? (
        <SquircleView
          squircleParams={{
            cornerSmoothing: 1,
            cornerRadius: 15,
            fillColor: theme.colors.base_1,
          }}
          style={{
            padding: theme.spacing.$2,
            maxWidth: "90%",
            height: BROWSER_INPUT_BAR_HEIGHT,
          }}
        >
          <XStack
            justifyContent={"space-between"}
            alignItems={"center"}
            width={"100%"}
          >
            <SvgIcon
              svgOfIcon={svgIcons.connectionBlubIcon}
              iconColor={theme.colors.content_1}
              onPress={() => {
                Burnt.toast({
                  title: "vault connecting coming soon!",
                  preset: "none",
                  message: "",
                });
              }}
            />
            <Pressable
              onPress={() => {
                setIsFocused(true); // Set isFocused to true to change the view
                setTimeout(() => {
                  textInputRef.current?.focus(); // Focus after a short delay
                }, 100); // Adjust the delay as needed
              }}
            >
              <Text
                variant="body_large"
                color="content_1"
                style={{
                  width: theme.dimensions.fullWidth * 0.5,
                  height: "100%",
                  textAlign: "center",
                  opacity: currentUrl?.hostname ? 1 : 0.5,
                }}
              >
                {currentUrl?.hostname ?? "enter webapp link"}
              </Text>
            </Pressable>

            <SvgIcon
              svgOfIcon={svgIcons.reloadIcon}
              iconColor={theme.colors.content_1}
              onPress={() => webViewRef.current?.reload()}
            />
          </XStack>
        </SquircleView>
      ) : (
        <GestureDetector gesture={swipeDownGesture}> */}
            <View
                style={{
                    width: theme.dimensions.fullWidth * 0.9,
                    height: BROWSER_INPUT_BAR_HEIGHT,
                    justifyContent: "center",
                    flexDirection: "row",
                    alignItems: "center",
                    position: "relative",
                    borderWidth: 1,
                    borderRadius: theme.spacing.$2,
                    borderColor: theme.colors.content_primary + 10,
                    backgroundColor: theme.colors.brand_green_tertiary + 15,
                    alignSelf: "stretch",
                    paddingHorizontal: theme.spacing.$2,
                }}
            >
                <TextInput
                    placeholder={"search dapps, AI tools & more"}
                    placeholderTextColor={theme.colors.content_primary + 50}
                    onChangeText={setUrl}
                    value={url}
                    style={{
                        color: theme.colors.content_primary,
                        ...theme.textVariants.heading_small,
                        flex: 1,
                        width: theme.dimensions.fullWidth * 0.85,
                    }}
                    autoCapitalize="none"
                    textContentType="URL"
                    autoFocus
                    selectionColor={theme.colors.color_1}
                    onSubmitEditing={() => {
                        const searchUrl = url.includes("https://")
                            ? url.includes("https://www.")
                                ? url.replace("https://www.", "https://")
                                : url
                            : `https://${url}`;
                        handleUrl(searchUrl);
                        bottomSheetRef?.current?.scrollTo(0);
                    }}
                    ref={textInputRef}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    clearButtonMode="always"
                />
                {loading && (
                    <ActivityIndicator
                        style={{
                            position: "absolute",
                            right: theme.spacing.$10,
                        }}
                        size="small"
                        color={theme.colors.content_1}
                    />
                )}
            </View>
            {/* </GestureDetector>
       )} */}
        </View>
    );
}
