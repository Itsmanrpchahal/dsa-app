import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// user id verify stack types
export type LandingStackParamList = {
    Landing: undefined;
    UserIdVerifyFlow: undefined;
};

export type LandingStackNavigationProp =
    NativeStackNavigationProp<LandingStackParamList>;

export const useLandingStackNavigation = (): LandingStackNavigationProp =>
    useNavigation<LandingStackNavigationProp>();

// sign in stack types

export type SignInStackParamList = {
    SignInFlow: undefined;
};

export type SignInStackNavigationProp =
    NativeStackNavigationProp<SignInStackParamList>;

export const useSignInStackNavigation = (): SignInStackNavigationProp =>
    useNavigation<SignInStackNavigationProp>();

// sign up stack types

export type SignUpStackParamList = {
    SignUpFlow: undefined;
};

export type SignUpStackNavigationProp =
    NativeStackNavigationProp<SignUpStackParamList>;

export const useSignUpStackNavigation = (): SignUpStackNavigationProp =>
    useNavigation<SignUpStackNavigationProp>();

// Auth stack types
export type AuthStackParamList = {
    UserIdVerifyStack: undefined;
    SignInStack: undefined;
    SignUpStack: undefined;
};

export type AuthStackNavigationProp =
    NativeStackNavigationProp<AuthStackParamList>;

export const useAuthStackNavigation = (): AuthStackNavigationProp =>
    useNavigation<AuthStackNavigationProp>();

// Browser stack types
export type BrowserStackParamList = {
    Browser: undefined;
};

export type BrowserStackNavigationProp =
    NativeStackNavigationProp<BrowserStackParamList>;

export const useBrowserStackNavigation = (): BrowserStackNavigationProp =>
    useNavigation<BrowserStackNavigationProp>();

// Feed stack types
export type FeedStackParamList = {
    Home: undefined;
};

export type FeedStackNavigationProp =
    NativeStackNavigationProp<FeedStackParamList>;

export const useFeedStackNavigation = (): FeedStackNavigationProp =>
    useNavigation<FeedStackNavigationProp>();

// Chat stack types
export type ChatStackParamList = {
    Chatbot: undefined;
    AppScreen: { appDetails?: any; appId?: string };
};

export type ChatStackNavigationProp = NativeStackNavigationProp<
    ChatStackParamList,
    "AppScreen"
>;

export const useChatStackNavigation = (): ChatStackNavigationProp =>
    useNavigation<ChatStackNavigationProp>();

//  Home stack types
export type HomeStackParamList = {
    AppTabs: undefined;
    UIScreen: undefined;
    ViewPostScreen: { postId?: string };
    HelpScreen: undefined;
    InviteScreen: undefined;
    PointsScreen: undefined;
    RandomAppScreen: undefined;
    Profile: { displayPicture: any };
    AppScreen: { appDetails?: any; appId?: string; source?: string };
    NewUpdate: undefined;
    WalletScreen: undefined;
    DepositIntoWalletScreen: undefined;
    ReceiveIntoWalletScreen: undefined;
    SendFromWalletScreen: undefined;
};

export type HomeStackNavigationProp = NativeStackNavigationProp<
    HomeStackParamList,
    "AppScreen",
    "Profile"
>;

export const useHomeStackNavigation = (): HomeStackNavigationProp =>
    useNavigation<HomeStackNavigationProp>();

//  Tab types
export type AppTabsParamList = {
    BrowserStack: undefined;
    ChatStack: undefined;
    FeedStack: undefined;
};

export type AppTabsNavigationProp = BottomTabNavigationProp<
    AppTabsParamList,
    "BrowserStack",
    "ChatStack"
>;

export const useAppTabsNavigation = (): AppTabsNavigationProp =>
    useNavigation<AppTabsNavigationProp>();
