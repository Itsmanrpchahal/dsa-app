import {
    NativeStackNavigationOptions,
    createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import { initializeOneSignal } from "../../config/onesignalClient";
import { fetchOnLanch } from "../../helpers/general";
import { registerDailyUsageAction } from "../../helpers/points/api/registerDailyUsageAction";
import AppScreen from "../../screens/AppScreen";
import HelpScreen from "../../screens/HelpScreen";
import InviteScreen from "../../screens/InviteScreen";
import NewUpdate from "../../screens/NewUpdate";
import PointsScreen from "../../screens/PointsScreen";
import ProfileScreen from "../../screens/Profile";
import RandomAppScreen from "../../screens/RandomAppScreen";
import ViewPostScreen from "../../screens/ViewPostScreen";
import UIScreen from "../../screens/dev/UIScreen";
import { useDailyUsageState } from "../../state/dailyUsageState";
import { HomeStackParamList } from "./../types";
import AppTabs from "./AppTabs";
import WalletScreen from "../../screens/WalletScreen";
import DepositIntoWalletScreen from "../../screens/wallet/DepositIntoWalletScreen";
import ReceiveIntoWalletScreen from "../../screens/wallet/ReceiveIntoWalletScreen";
import SendFromWalletScreen from "../../screens/wallet/SendFromWalletScreen";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
    useEffect(() => {
        fetchOnLanch();
        initializeOneSignal();
    }, []);

    // navigation modal options

    const modalOptions: NativeStackNavigationOptions = {
        presentation: "modal",
    };

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="AppTabs" component={AppTabs} />
            <Stack.Screen
                name="HelpScreen"
                // @ts-ignore
                component={HelpScreen}
                options={modalOptions}
            />
            <Stack.Screen
                name="UIScreen"
                component={UIScreen}
                options={modalOptions}
            />
            <Stack.Screen
                name="Profile"
                // @ts-ignore
                component={ProfileScreen}
                options={modalOptions}
            />
            <Stack.Screen
                name="PointsScreen"
                component={PointsScreen}
                options={modalOptions}
            />
            <Stack.Screen
                name="RandomAppScreen"
                component={RandomAppScreen}
                options={modalOptions}
            />
            <Stack.Screen
                name="AppScreen"
                // @ts-ignore
                component={AppScreen}
                options={modalOptions}
            />
            <Stack.Screen
                name="ViewPostScreen"
                // @ts-ignore
                component={ViewPostScreen}
                // options={modalOptions}
            />
            <Stack.Screen
                name="InviteScreen"
                component={InviteScreen}
                options={modalOptions}
            />
            <Stack.Screen
                name="NewUpdate"
                component={NewUpdate}
                options={modalOptions}
            />
            <Stack.Screen
                name="WalletScreen"
                component={WalletScreen}
                options={modalOptions}
            />
            <Stack.Screen
                name="DepositIntoWalletScreen"
                component={DepositIntoWalletScreen}
                options={modalOptions}
            />
            <Stack.Screen
                name="ReceiveIntoWalletScreen"
                component={ReceiveIntoWalletScreen}
                options={modalOptions}
            />
            <Stack.Screen
                name="SendFromWalletScreen"
                component={SendFromWalletScreen}
                options={modalOptions}
            />
        </Stack.Navigator>
    );
}
