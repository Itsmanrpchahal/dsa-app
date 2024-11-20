import { ScrollView } from "react-native";
import { Text, theme } from "../../../ui";
import { YStack } from "../../../ui/stack";
import RecentWebApps from "./RecentWebApps";
import TrendingWebApps from "./TrendingWebApps";
import DiscoverTabs from "./tabs/DiscoverTabs";

const ColdStartIntroForBrowser = () => {
    return (
        <YStack
            justifyContent={"center"}
            alignItems={"center"}
            width={"auto"}
            style={{ paddingTop: theme.spacing.$5 }}
            gap={theme.spacing.$5}
        >
            <Text
                variant="heading_small_italic"
                color={"content_1"}
                style={{
                    textAlign: "center",
                }}
            >
                Discover
            </Text>
        </YStack>
    );
};

export default function Discover() {
    return (
        <YStack
            justifyContent={"flex-start"}
            alignItems={"center"}
            width={"100%"}
            style={{
                flex: 1,
            }}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    flexGrow: 1,
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    rowGap: theme.spacing.$3,
                }}
                style={{ flex: 1 }}
            >
                {/* <ColdStartIntroForBrowser /> */}
                <DiscoverTabs />
            </ScrollView>
        </YStack>
    );
}
