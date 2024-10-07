import { useThemeColors } from "@/hooks/useThemeColors";
import { useEffect } from "react";
import { ViewProps, ViewStyle } from "react-native";
import Animated, {
  ReduceMotion,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = ViewProps & {
  backbgroundColor?: string;
};

export function RootView({ style, backbgroundColor, ...rest }: Props) {
  const colors = useThemeColors();
  const progress = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [colors.tint, backbgroundColor ?? colors.tint]
      ),
    };
  }, [backbgroundColor]);

  useEffect(() => {
    if (backbgroundColor) {
      progress.value=0
      progress.value = withTiming(1, {
        duration: 1000,
        easing: Easing.out(Easing.quad),
        reduceMotion: ReduceMotion.System,
      });
    }
  }, [backbgroundColor]);

  if (!backbgroundColor) {
    return (
      <SafeAreaView
        style={[rootStyle, { backgroundColor: colors.tint }, style]}
        {...rest}
      />
    );
  }
  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle, style]}>
      <SafeAreaView style={rootStyle} {...rest}></SafeAreaView>
    </Animated.View>
  );
}

const rootStyle = {
  flex: 1,
  padding: 4,
} satisfies ViewStyle;
