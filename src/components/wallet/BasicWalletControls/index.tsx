import { svgIcons } from "../../../config/constants/iconSvgs";
import { useHomeStackNavigation } from "../../../navigation/types";
import { theme } from "../../../ui";
import { XStack } from "../../../ui/stack";
import WalletControlButton from "./WalletControlButton";

export default function BasicWalletControls() {
    const navigation = useHomeStackNavigation();

    return (
        <XStack
            justifyContent={"space-evenly"}
            alignItems={"center"}
            width={"auto"}
            style={{
                marginHorizontal: theme.spacing.$3,
                marginBottom: theme.spacing.$8,
            }}
        >
            <WalletControlButton
                svgOfIcon={svgIcons.addIcon}
                label={"Deposit"}
                onClick={() => {
                    navigation.navigate("DepositIntoWalletScreen");
                }}
            />
            <WalletControlButton
                svgOfIcon={svgIcons.sendIcon}
                label={"Send"}
                onClick={() => {
                    navigation.navigate("SendFromWalletScreen");
                }}
            />
            <WalletControlButton
                svgOfIcon={svgIcons.receiveIcon}
                label={"Recieve"}
                onClick={() => {
                    navigation.navigate("ReceiveIntoWalletScreen");
                }}
            />
        </XStack>
    );
}
