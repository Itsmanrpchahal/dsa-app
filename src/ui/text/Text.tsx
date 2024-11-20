import { createText } from "@shopify/restyle";
import { Theme } from "../theme/theme";
import Animated from "react-native-reanimated";

const Text = createText<Theme>();

export default Animated.createAnimatedComponent(Text);
