import { Platform } from "react-native";

export const IS_WEB = Platform.OS === "web";

export const RESTAURANTS = ["Anteatery", "Brandywine"] as const

export type Restaurant = typeof RESTAURANTS[number]
