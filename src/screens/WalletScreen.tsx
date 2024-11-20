import { useEffect, useMemo, useState } from "react";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import BasicWalletControls from "../components/wallet/BasicWalletControls/index";
import BasicWalletDetails from "../components/wallet/BasicWalletDetails";
import NFTBalances from "../components/wallet/NFTBalances";
import TokenBalances from "../components/wallet/TokenBalances";
import WalletActivity from "../components/wallet/WalletActivity";
import useDailyActivityViewHideState from "../state/helpViewHideState";
import { theme } from "../ui";
import { ModalScreen } from "../ui/screens";

export default function WalletScreen() {
    const { setDailyActivityViewHide } = useDailyActivityViewHideState();

    useEffect(() => {
        setDailyActivityViewHide(false);
    }, []);

    const TokensRoute = () => <TokenBalances />;

    const NFTsRoute = () => <NFTBalances />;

    const ActivityRoute = () => <WalletActivity />;

    const renderScene = useMemo(
        () =>
            SceneMap({
                tokens: TokensRoute,
                nfts: NFTsRoute,
                activity: ActivityRoute,
            }),
        []
    );

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "tokens", title: "tokens" },
        { key: "nfts", title: "nfts" },
        { key: "activity", title: "activity" },
    ]);

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: theme.colors.transparent }}
            style={{
                backgroundColor: theme.colors.transparent,
            }}
        />
    );

    return (
        <ModalScreen title="Vault" trackingName="Wallet Screen">
            <BasicWalletDetails />
            <BasicWalletControls />
            <TabView
                renderTabBar={renderTabBar}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: theme.dimensions.fullWidth }}
            />
        </ModalScreen>
    );
}
