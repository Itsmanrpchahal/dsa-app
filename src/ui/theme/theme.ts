import { createTheme } from "@shopify/restyle";
import { colors } from "./colors";
import { spacing } from "./spacing";
import { textVariants } from "../text";
import { Dimensions } from "react-native";

const dimensions = {
    fullHeight: Dimensions.get("window").height,
    fullWidth: Dimensions.get("window").width,
};

const theme = createTheme({
    colors: colors,
    spacing: spacing,
    textVariants: textVariants,
    dimensions: dimensions,
});

export type Theme = typeof theme;
export default theme;
