import React from "react";
import { Platform, Text, TextProps, View } from "react-native";

import { NutritionInfo } from "../hooks/useZotmealStore";

const units = {
  calories: "cal",
  totalFatG: "g",
  transFatG: "g",
  saturatedFatG: "g",
  cholesterolMg: "mg",
  sodiumMg: "mg",
  totalCarbsG: "g",
  dietaryFiberG: "g",
  sugarsMg: "mg",
  proteinG: "g",
  vitaminAIU: "IU",
  vitaminCIU: "IU",
  calciumMg: "mg",
  ironMg: "mg",
  // caloriesFromFat
} as const satisfies Partial<Record<keyof NutritionInfo, string>>;

// TODO: This is just a quick polyfill of NutritionFacts from the old tamagui app. Change if needed

export function NutritionFacts({
  nutritionInfo,
  color,
}: Readonly<{
  nutritionInfo: NutritionInfo;
  color: string;
}>) {
  function Separator({ marginVertical, borderWidth }: any) {
    return (
      <View
        style={{
          height: 1,
          marginVertical,
          backgroundColor: color,
          borderWidth,
          borderColor: color,
        }}
      />
    );
  }

  function XStack({ justifyContent, children }: any) {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent,
        }}
      >
        {children}
      </View>
    );
  }

  const baseTextStyle = {
    color,
  };

  const baseTextProps = {
    style: {
      ...baseTextStyle,
      fontWeight: 600,
      fontSize: Platform.OS === "ios" ? undefined : 12,
    },
  } as const satisfies Partial<TextProps>;

  function H3({ children }: any) {
    return (
      <Text
        style={{
          fontSize: Platform.OS === "ios" ? 20 : 16,
          fontWeight: "bold",
          ...baseTextStyle,
        }}
      >
        {children}
      </Text>
    );
  }

  function H4({ children }: any) {
    return (
      <Text
        style={{
          fontSize: Platform.OS === "ios" ? 16 : 13,
          fontWeight: "bold",
          ...baseTextStyle,
        }}
      >
        {children}
      </Text>
    );
  }

  return (
    <View
      style={{
        borderWidth: 3,
        borderColor: color,
      }}
    >
      <H3>Nutrition Facts</H3>
      <Separator marginVertical={3} borderWidth={1} />
      <XStack justifyContent="space-between">
        <Text {...baseTextProps}>Serving Size</Text>
        <Text {...baseTextProps}>
          {nutritionInfo.servingSize ?? "?"}
          {nutritionInfo.servingUnit}
        </Text>
      </XStack>
      <Separator marginVertical={3} borderWidth={7} />
      <Text {...baseTextProps}>Amount per serving</Text>
      <XStack justifyContent="space-between">
        <H4>Calories</H4>
        <H4>{nutritionInfo.calories ?? "?"}</H4>
      </XStack>
      <Separator marginVertical={3} borderWidth={4} />
      {/* TODO: Add % Daily Value */}
      {/* <Text {...baseTextProps}>% Daily Value*</Text> */}
      <Text {...baseTextProps}>
        <Text {...baseTextProps}>Total Fat</Text>{" "}
        {nutritionInfo.totalFatG ?? "?"}
        {units.totalFatG}
      </Text>
      <Separator marginVertical={3} borderWidth={1} />
      <Text {...baseTextProps}>
        Saturated Fat{" "}
        {nutritionInfo.saturatedFatG ? nutritionInfo.saturatedFatG : "?"}
        {units.saturatedFatG}
      </Text>
      <Separator marginVertical={3} borderWidth={1} />
      <Text {...baseTextProps}>
        Trans Fat {nutritionInfo.transFatG ?? "?"}
        {units.transFatG}
      </Text>
      <Separator marginVertical={3} borderWidth={1} />
      <Text {...baseTextProps}>
        <Text {...baseTextProps}>Cholesterol</Text>{" "}
        {nutritionInfo.cholesterolMg ?? "?"}
        {units.cholesterolMg}
      </Text>
      <Separator marginVertical={3} borderWidth={1} />
      <Text {...baseTextProps}>
        <Text {...baseTextProps}>Sodium</Text> {nutritionInfo.sodiumMg ?? "?"}
        {units.sodiumMg}
      </Text>
      <Separator marginVertical={3} borderWidth={1} />
      <Text {...baseTextProps}>
        <Text {...baseTextProps}>Total Carbohydrates</Text>{" "}
        {nutritionInfo.totalCarbsG ?? "?"}
        {units.totalCarbsG}
      </Text>
      <Separator marginVertical={3} borderWidth={1} />
      <Text {...baseTextProps}>
        Dietary Fiber {nutritionInfo.dietaryFiberG ?? "?"}
        {units.dietaryFiberG}
      </Text>
      <Separator marginVertical={3} borderWidth={1} />
      <Text {...baseTextProps}>
        Sugars {nutritionInfo.sugarsMg ?? "?"}
        {units.sugarsMg}
      </Text>
      <Separator marginVertical={3} borderWidth={1} />
      <Text {...baseTextProps}>
        <Text {...baseTextProps}>Sodium</Text> {nutritionInfo.proteinG ?? "?"}
        {units.proteinG}
      </Text>
      <Separator marginVertical={3} borderWidth={7} />
      <XStack justifyContent="space-between">
        <Text {...baseTextProps}>
          Vitamin A {nutritionInfo.vitaminAIU ?? "?"} {units.vitaminAIU}
        </Text>
      </XStack>
      <Separator marginVertical={3} borderWidth={1} />
      <XStack justifyContent="space-between">
        <Text {...baseTextProps}>
          Vitamin C {nutritionInfo.vitaminCIU ?? "?"} {units.vitaminCIU}
        </Text>
      </XStack>
      <Separator marginVertical={3} borderWidth={1} />
      <XStack justifyContent="space-between">
        <Text {...baseTextProps}>
          Iron {nutritionInfo.ironMg ?? "?"}
          {units.ironMg}
        </Text>
      </XStack>
      <Separator marginVertical={3} borderWidth={1} />
      <XStack justifyContent="space-between">
        <Text {...baseTextProps}>
          Calcium {nutritionInfo.calciumMg ?? "?"}
          {units.calciumMg}
        </Text>
      </XStack>
      <Separator marginVertical={3} borderWidth={4} />
      <Text {...baseTextProps}>
        * Some nutrition facts may not be disclosed by the dining halls. Contact
        the dining hall if you need more information.
        {/* The % Daily Value tells you how much a nutrient in a serving of food
            contributes to a daily diet. 2,000 calories a day is used for general
            nutrition advice. */}
      </Text>
    </View>
  );
}
