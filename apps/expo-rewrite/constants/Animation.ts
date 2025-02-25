import { ReduceMotion, WithSpringConfig } from "react-native-reanimated";

export const defaultSpringConfig = {
  duration: 750,
  dampingRatio: 1.2,
  stiffness: 109,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
  reduceMotion: ReduceMotion.System,
} as const satisfies WithSpringConfig;
