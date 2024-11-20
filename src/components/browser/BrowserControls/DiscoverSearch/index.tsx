import { MEROKU_API_HOST } from "@env";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import WebView from "react-native-webview";
import { getAutoCompleteSearch } from "../../../../helpers/browser/api/getAutoCompleteSearch";
import { useCurrentTabState } from "../../../../state/currentTabState";
import { Text, theme } from "../../../../ui";
import { BottomSheetRefProps, BottomSheet } from "../../../../ui/bottomsheet";
import { XStack, YStack } from "../../../../ui/stack";
import AddressBar from "./AddressBar";
import SearchResultComponent from "./SearchResultComponent";
import _ from "lodash";
import { Clickable } from "../../../../ui/clickable";

interface DiscoverSearchProps {
    webViewRef: React.RefObject<WebView>;
    bottomSheetRef: React.RefObject<BottomSheetRefProps>;
}
const debounceSearch = getAutoCompleteSearch;
export default function DiscoverSearch({
    webViewRef,
    bottomSheetRef,
}: DiscoverSearchProps) {
    const styles = StyleSheet.create({
        motiView: {
            borderTopLeftRadius: theme.spacing.$2,
            borderTopRightRadius: theme.spacing.$2,
        },
    });

    const [search, setSearch] = useState<string>("");
    const isDirectAddress: boolean =
        /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:[0-9]{1,})?([\/?].*)?$/.test(
            search
        ); // Check if the search is a direct address (true or false)
    const [searchData, setSearchData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isURL, setIsURL] = useState<boolean>(false);

    const handleSearch = (search: string) => {
        setSearch(search);
    };

    useEffect(() => {
        if (search.length === 0) {
            setSearchData([]);
            setLoading(false);
            setIsURL(false);
        } else {
            debouncedSearch(search);
            setIsURL(isDirectAddress);
        }
    }, [search]);

    // Debounce the function call
    const debouncedSearch = _.debounce(async (search) => {
        setLoading(true);
        await debounceSearch(search)
            ?.then((response): void => {
                setSearchData(response?.data.slice(0, 3));
                setLoading(false);
            })
            .catch((e) => {
                setLoading(false);
            });
    }, 1000); // Debounce time in milliseconds (adjust as needed)

    return (
        <BottomSheet
            ref={bottomSheetRef}
            sheetBackdropHeight={50}
            trackingName={""}
        >
            <YStack
                style={styles.motiView}
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"auto"}
            >
                <AddressBar
                    webViewRef={webViewRef}
                    searchData={handleSearch}
                    bottomSheetRef={bottomSheetRef}
                    loading={loading}
                />

                <XStack
                    alignItems={"center"}
                    justifyContent={"center"}
                    width={theme.dimensions.fullWidth * 0.9}
                    style={{
                        height: "100%",
                    }}
                >
                    <FlashList
                        data={search && search.length > 0 ? searchData : []}
                        estimatedItemSize={100}
                        ListHeaderComponent={
                            isURL ? (
                                <Clickable
                                    trackingName="Discover Search Result If Url Clicked"
                                    trackingParameters={{
                                        url: search.includes("https://")
                                            ? search.includes("https://www.")
                                                ? search.replace(
                                                      "https://www.",
                                                      "https://"
                                                  )
                                                : search
                                            : `https://${search}`,
                                        hostname: search.includes("https://")
                                            ? search.includes("https://www.")
                                                ? search.replace(
                                                      "https://www.",
                                                      "https://"
                                                  )
                                                : search
                                            : `https://${search}`,
                                    }}
                                    onPress={() => {
                                        bottomSheetRef?.current?.scrollTo(0);
                                        useCurrentTabState
                                            .getState()
                                            .setCurrentTab({
                                                url: search.includes("https://")
                                                    ? search.includes(
                                                          "https://www."
                                                      )
                                                        ? search.replace(
                                                              "https://www.",
                                                              "https://"
                                                          )
                                                        : search
                                                    : `https://${search}`,
                                                hostname: search.includes(
                                                    "https://"
                                                )
                                                    ? search.includes(
                                                          "https://www."
                                                      )
                                                        ? search.replace(
                                                              "https://www.",
                                                              "https://"
                                                          )
                                                        : search
                                                    : `https://${search}`,
                                                hostNameUrl: "",
                                            });
                                    }}
                                >
                                    <SearchResultComponent
                                        isURL={isURL}
                                        search={search}
                                    />
                                </Clickable>
                            ) : null
                        }
                        ListFooterComponent={
                            search ? (
                                <Clickable
                                    trackingName="Discover Search Result If Google Search Clicked"
                                    trackingParameters={{
                                        url: `https://www.google.com/search?q=${search}`,
                                        hostname: search,
                                    }}
                                    onPress={() => {
                                        bottomSheetRef?.current?.scrollTo(0);
                                        useCurrentTabState
                                            .getState()
                                            .setCurrentTab({
                                                url: `https://www.google.com/search?q=${search}`,
                                                hostname: search,
                                                hostNameUrl: "google.com",
                                            });
                                    }}
                                >
                                    <SearchResultComponent search={search} />
                                </Clickable>
                            ) : null
                        }
                        renderItem={({ item, index }) => {
                            return (
                                <Clickable
                                    trackingName="Discover Search Result If Dapp Clicked"
                                    trackingParameters={{
                                        dappId: item.dappId,
                                        url: `${MEROKU_API_HOST}/o/view/${item.dappId}?userId=anon_dsa`,
                                        hostname: item?.name?.toLowerCase(),
                                    }}
                                    onPress={() => {
                                        bottomSheetRef?.current?.scrollTo(0);
                                        useCurrentTabState
                                            .getState()
                                            .setCurrentTab({
                                                url: `${MEROKU_API_HOST}/o/view/${item.dappId}?userId=anon_dsa`,
                                                hostname:
                                                    item?.name?.toLowerCase(),
                                                hostNameUrl: `${MEROKU_API_HOST}`,
                                            });
                                    }}
                                >
                                    <XStack
                                        alignItems="flex-start"
                                        justifyContent="flex-start"
                                        width={
                                            theme.dimensions.fullWidth * 0.85
                                        }
                                        style={{
                                            padding: theme.spacing.$2,
                                        }}
                                    >
                                        <Image
                                            source={{
                                                uri: item?.cdn?.images?.logo,
                                            }}
                                            style={{
                                                width: theme.spacing.$6,
                                                height: theme.spacing.$6,
                                                borderRadius: theme.spacing.$3,
                                            }}
                                        />
                                        <Text
                                            variant="body_small"
                                            color={"light"}
                                            textAlign={"right"}
                                            style={{
                                                marginTop: theme.spacing.$1,
                                                paddingHorizontal:
                                                    theme.spacing.$2,
                                            }}
                                        >
                                            {item?.name}
                                        </Text>
                                    </XStack>
                                </Clickable>
                            );
                        }}
                    ></FlashList>
                </XStack>
            </YStack>
        </BottomSheet>
    );
}
