import React, { forwardRef } from "react";
import { View } from "react-native";
import { SquircleView, SquircleViewProps } from "react-native-figma-squircle";
import Animated from "react-native-reanimated";

const WrappedSquircleView = forwardRef<View, SquircleViewProps>(
    (props, ref) => {
        return <SquircleView {...props} />;
    }
);

export const AnimatedSquircleView =
    Animated.createAnimatedComponent(WrappedSquircleView);
