import * as Haptics from "expo-haptics";

export function triggerHaptic() {
  if (process.env.EXPO_OS === "ios") {
    // Add a soft haptic feedback when pressing down on the tabs.
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}
