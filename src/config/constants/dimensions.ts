import { Platform } from "react-native";
import { theme } from "../../ui";

export const HOME_HEADER_HEIGHT = theme.dimensions.fullHeight * 0.125;
export const APP_SUGGESTIONS_HEIGHT = Platform.OS === "ios" ? 100 : 95;
export const BROWSER_INPUT_BAR_HEIGHT = 45;
export const BROWSER_CONTROLS_BAR_HEIGHT = 35;
