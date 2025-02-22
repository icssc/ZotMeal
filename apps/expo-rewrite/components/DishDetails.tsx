import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { defaultSpringConfig } from "../constants/Animation";
import { Dish, useZotmealStore } from "../hooks/useZotmealStore";
import { colorShade, getContrastText, stringToColor } from "../utils/color";
import { getDishRating } from "../utils/dish";
import { NutritionFacts } from "./NutritionFacts";
import { ThemedText } from "./ThemedText";
import { IconSymbol } from "./ui/IconSymbol";

// TODO: disable button if not logged in (once auth is implemented)
function DishRatingButton({ dish }: { dish: Dish }) {
  const categoryColor = stringToColor(dish.category);
  const textColor = getContrastText(categoryColor);
  const open = useSharedValue(false);
  const selectedRating = useSharedValue(0);
  const rating = getDishRating(dish);
  const triggerSuccessAmount = useSharedValue(0);
  const triggerColor = colorShade(categoryColor, -20);
  const triggerColorSuccess = colorShade(categoryColor, 40);

  const triggerStyles = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      triggerSuccessAmount.value,
      [0, 1],
      [triggerColor, triggerColorSuccess],
    ),
  }));

  const confirmButtonStyles = useAnimatedStyle(() => ({
    display: withDelay(
      100,
      withSpring(!open.value || selectedRating.value === 0 ? "none" : "flex"),
    ),
    opacity: withSpring(!open.value || selectedRating.value === 0 ? 0 : 1, {
      ...defaultSpringConfig,
      duration: 100,
    }),
    transform: [
      {
        translateY: withSpring(open.value ? "-125%" : "-50%", {
          ...defaultSpringConfig,
          duration: 400,
        }),
      },
      {
        translateX: withSpring(selectedRating.value === 0 ? "-200%" : "-325%", {
          ...defaultSpringConfig,
          duration: 400,
        }),
      },
    ],
  }));

  const starsContainerStyles = useAnimatedStyle(() => ({
    display: withDelay(100, withSpring(open.value ? "flex" : "none")),
    opacity: withTiming(open.value ? 1 : 0, {
      ...defaultSpringConfig,
      duration: 100,
    }),
    transform: [
      {
        translateY: withSpring(open.value ? "-125%" : "-50%", {
          ...defaultSpringConfig,
          duration: 400,
        }),
      },
      {
        translateX: "-50%",
      },
    ],
  }));

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          // TODO: do optimistic rate dish mutation
          // see: https://stackoverflow.com/questions/74671735/optimistic-updates-with-react-query-trpc
          triggerSuccessAmount.value = withSequence(
            withDelay(
              100,
              withSpring(1, { ...defaultSpringConfig, duration: 50 }),
            ),
            withDelay(400, withTiming(0, { duration: 600 })),
          );
          open.value = false;
          selectedRating.value = 0;
        }}
      >
        <Animated.View
          style={[
            confirmButtonStyles,
            {
              width: 35,
              height: 35,
              padding: 8,
              paddingHorizontal: 10,
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              backgroundColor: colorShade(categoryColor, -20),
              borderRadius: 100,
              left: "0%",
            },
          ]}
        >
          <IconSymbol name="checkmark" color={textColor} size={19} />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View
        style={[
          starsContainerStyles,
          {
            position: "absolute",
            left: "50%",
          },
        ]}
      >
        <View
          style={{
            padding: 5,
            paddingHorizontal: 10,
            borderRadius: 25,
            backgroundColor: colorShade(categoryColor, -20),
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          {Array.from({ length: 5 }).map((_, i) => {
            const starStyle = useAnimatedStyle(() => ({
              opacity: i + 1 > selectedRating.value ? 0 : 1,
            }));

            return (
              <Pressable
                key={i}
                onPress={() => (selectedRating.value = i + 1)}
                style={{
                  width: 25,
                  height: 25,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Animated.View style={{ position: "absolute" }}>
                  <IconSymbol name="star" color={textColor} size={25} />
                </Animated.View>
                <Animated.View style={starStyle}>
                  <IconSymbol name="star.fill" color={textColor} size={25} />
                </Animated.View>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>
      <TouchableOpacity
        onPress={() => {
          open.value = !open.value;
          if (selectedRating.value !== 0) selectedRating.value = 0;
        }}
      >
        <Animated.View
          style={[
            triggerStyles,
            {
              padding: 5,
              paddingHorizontal: 10,
              borderRadius: 25,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            },
          ]}
        >
          <IconSymbol name="star.fill" color={textColor} size={15} />
          <ThemedText type="defaultSemiBold" style={{ color: textColor }}>
            {rating}
          </ThemedText>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

export function DishDetails() {
  const { selectedItem: dish } = useZotmealStore();
  if (!dish || dish.type !== "Dish") return null;

  const categoryColor = stringToColor(dish.category);
  const textColor = getContrastText(categoryColor);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: categoryColor,
        borderRadius: 25,
        padding: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ThemedText
          type="defaultSemiBold"
          style={{
            color: getContrastText(categoryColor),
            fontSize: 20,
            width: "50%",
            lineHeight: 24,
          }}
        >
          {dish.name}
        </ThemedText>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <DishRatingButton dish={dish} />
          <TouchableOpacity
            style={{
              padding: 5,
              paddingHorizontal: 10,
              borderRadius: 25,
              backgroundColor: colorShade(categoryColor, -20),
            }}
          >
            <IconSymbol name="pin.fill" color={textColor} size={18} />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          height: 2,
          backgroundColor: colorShade(categoryColor, -20),
          borderRadius: 25,
          marginVertical: 5,
        }}
      />
      <ThemedText
        style={{
          fontSize: 13,
          color: textColor,
          backgroundColor: colorShade(categoryColor, -20),
          marginTop: 10,
          padding: 10,
          borderRadius: 10,
          lineHeight: 20,
        }}
      >
        {dish.description.trim() === ""
          ? "No description available."
          : dish.description}
      </ThemedText>
      <ScrollView
        contentContainerStyle={{
          width: 250,
          alignItems: "center",
          margin: "auto",
          marginTop: 20,
        }}
      >
        <NutritionFacts nutritionInfo={dish.nutritionInfo} color={textColor} />
      </ScrollView>
    </View>
  );
}
