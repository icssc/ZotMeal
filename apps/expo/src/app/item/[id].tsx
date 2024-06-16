import { Platform } from "react-native";
import { Link, Redirect, Stack, useGlobalSearchParams } from "expo-router";
import { ArrowRight } from "@tamagui/lucide-icons";
import {
  H3,
  H4,
  Image,
  Paragraph,
  ScrollView,
  Separator,
  Text,
  useTheme,
  View,
  XStack,
  YStack,
} from "tamagui";

import { PinButton } from "~/components";
import { NutritionInfo, useZotmealStore } from "~/utils";
import { testDishImages } from "../../components/menu/testDishImages";
import RateItem from "./RateItem";

export default function MenuItem() {
  const theme = useTheme();
  const { zotmeal } = useZotmealStore();
  const { id, stationId, menuId, restaurant } = useGlobalSearchParams();

  if (!id || typeof id !== "string") throw new Error("id is not a string");
  if (!zotmeal) throw new Error("zotmeal is not defined");
  if (!stationId || typeof stationId !== "string")
    throw new Error("stationId is not a string");
  if (!menuId || typeof menuId !== "string")
    throw new Error("menuId is not a string");
  if (restaurant !== "anteatery" && restaurant !== "brandywine")
    throw new Error("restaurant is not a string");

  const menu = zotmeal[restaurant].menus.find((menu) => menu.id === menuId);

  // TODO: Log error if menu is not found
  if (!menu) return <Redirect href="/" />;

  const station = menu.stations.find((station) => station.id === stationId);

  // TODO: Log error if station is not found
  if (!station) return <Redirect href="/" />;

  const dish = station.dishes.find((dish) => dish.id === id);

  // TODO: Log error if dish is not found
  if (!dish) return <Redirect href="/" />;

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

  const NutritionFacts = ({
    nutritionInfo,
  }: {
    nutritionInfo: NutritionInfo;
  }) => (
    <YStack
      padding="$3"
      borderWidth={2}
      borderColor={theme.borderColor}
      width="90%"
      maxWidth={500}
      alignSelf="center"
    >
      <H3>Nutrition Facts</H3>
      <Separator marginVertical="$2" borderWidth={1} />
      <XStack
        justifyContent="space-between"
        opacity={nutritionInfo.servingSize ? 1 : 0.5}
      >
        <Text fontWeight="800">Serving Size</Text>
        <Text fontWeight="800">
          {nutritionInfo.servingSize ?? "?"}
          {nutritionInfo.servingUnit}
        </Text>
      </XStack>
      <Separator marginVertical="$2" borderWidth={7} />
      <Text opacity={nutritionInfo.calories ? 1 : 0.5}>Amount per serving</Text>
      <XStack
        justifyContent="space-between"
        opacity={nutritionInfo.calories ? 1 : 0.5}
      >
        <H4>Calories</H4>
        <H4>{nutritionInfo.calories ?? "?"}</H4>
      </XStack>
      <Separator marginVertical="$2" borderWidth={4} />
      {/* TODO: Add % Daily Value */}
      {/* <Text>% Daily Value*</Text> */}
      <Text opacity={nutritionInfo.totalFatG ? 1 : 0.5}>
        <Text fontWeight="800">Total Fat</Text> {nutritionInfo.totalFatG ?? "?"}
        {units.totalFatG}
      </Text>
      <Separator marginVertical="$2" borderWidth={1} />
      <Text paddingLeft="$4" opacity={nutritionInfo.saturatedFatG ? 1 : 0.5}>
        Saturated Fat{" "}
        {nutritionInfo.saturatedFatG ? nutritionInfo.saturatedFatG : "?"}
        {units.saturatedFatG}
      </Text>
      <Separator marginVertical="$2" borderWidth={1} />
      <Text paddingLeft="$4" opacity={nutritionInfo.transFatG ? 1 : 0.5}>
        Trans Fat {nutritionInfo.transFatG ?? "?"}
        {units.transFatG}
      </Text>
      <Separator marginVertical="$2" borderWidth={1} />
      <Text opacity={nutritionInfo.cholesterolMg ? 1 : 0.5}>
        <Text fontWeight="800">Cholesterol</Text>{" "}
        {nutritionInfo.cholesterolMg ?? "?"}
        {units.cholesterolMg}
      </Text>
      <Separator marginVertical="$2" borderWidth={1} />
      <Text opacity={nutritionInfo.sodiumMg ? 1 : 0.5}>
        <Text fontWeight="800">Sodium</Text> {nutritionInfo.sodiumMg ?? "?"}
        {units.sodiumMg}
      </Text>
      <Separator marginVertical="$2" borderWidth={1} />
      <Text opacity={nutritionInfo.totalCarbsG ? 1 : 0.5}>
        <Text fontWeight="800">Total Carbohydrates</Text>{" "}
        {nutritionInfo.totalCarbsG ?? "?"}
        {units.totalCarbsG}
      </Text>
      <Separator marginVertical="$2" borderWidth={1} />
      <Text paddingLeft="$4" opacity={nutritionInfo.dietaryFiberG ? 1 : 0.5}>
        Dietary Fiber {nutritionInfo.dietaryFiberG ?? "?"}
        {units.dietaryFiberG}
      </Text>
      <Separator marginVertical="$2" borderWidth={1} />
      <Text paddingLeft="$4" opacity={nutritionInfo.sugarsMg ? 1 : 0.5}>
        Sugars {nutritionInfo.sugarsMg ?? "?"}
        {units.sugarsMg}
      </Text>
      <Separator marginVertical="$2" borderWidth={1} />
      <Text opacity={nutritionInfo.proteinG ? 1 : 0.5}>
        <Text fontWeight="800">Sodium</Text> {nutritionInfo.proteinG ?? "?"}
        {units.proteinG}
      </Text>
      <Separator marginVertical="$2" borderWidth={7} />
      <XStack justifyContent="space-between">
        <Text opacity={nutritionInfo.vitaminAIU ? 1 : 0.5}>
          Vitamin A {nutritionInfo.vitaminAIU ?? "?"} {units.vitaminAIU}
        </Text>
        <Text></Text>
      </XStack>
      <Separator marginVertical="$2" borderWidth={1} />
      <XStack justifyContent="space-between">
        <Text opacity={nutritionInfo.vitaminCIU ? 1 : 0.5}>
          Vitamin C {nutritionInfo.vitaminCIU ?? "?"} {units.vitaminCIU}
        </Text>
        <Text></Text>
      </XStack>
      <Separator marginVertical="$2" borderWidth={1} />
      <XStack justifyContent="space-between">
        <Text opacity={nutritionInfo.ironMg ? 1 : 0.5}>
          Iron {nutritionInfo.ironMg ?? "?"}
          {units.ironMg}
        </Text>
        <Text></Text>
      </XStack>
      <Separator marginVertical="$2" borderWidth={1} />
      <XStack justifyContent="space-between">
        <Text opacity={nutritionInfo.calciumMg ? 1 : 0.5}>
          Calcium {nutritionInfo.calciumMg ?? "?"}
          {units.calciumMg}
        </Text>
        <Text></Text>
      </XStack>
      <Separator marginVertical="$2" borderWidth={4} />
      <Paragraph>
        * Some nutrition facts may not be disclosed by the dining halls. Contact
        the dining hall if you need more information.
        {/* The % Daily Value tells you how much a nutrient in a serving of food
        contributes to a daily diet. 2,000 calories a day is used for general
        nutrition advice. */}
      </Paragraph>
    </YStack>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: dish.name,
          headerBackTitle: "Home",
          headerTitleStyle: { color: "white" },
        }}
      />
      <ScrollView height="100%" width="100%">
        <Image
          source={{
            uri: testDishImages[
              Math.floor(Math.random() * testDishImages.length)
            ],
          }}
          width="100%"
          maxWidth={300}
          alignSelf="center"
          height={Platform.OS === "web" ? 300 : 200}
        />

        <View padding="$4">
          <XStack alignItems="center">
            <Link href="/">
              <Text fontSize="$5" color="deepskyblue">
                {restaurant.charAt(0).toUpperCase() + restaurant.slice(1)}
              </Text>
            </Link>
            <ArrowRight color="deepskyblue" size="$1" />
            <Text fontSize="$5" color="deepskyblue">
              {station.name}
            </Text>
          </XStack>
          <H3>{dish.name ?? "No name found"}</H3>
          <Text>{dish.description ?? "No description found."}</Text>
          <XStack justifyContent="space-between" paddingVertical="$4">
            <RateItem item={dish} />
            <PinButton
              minWidth="30%"
              fontWeight="800"
              borderRadius="$10"
              dishName={dish.name}
              paddingHorizontal="$4"
            />
          </XStack>
          <NutritionFacts nutritionInfo={dish.nutritionInfo} />
        </View>
        <View height={100} />
      </ScrollView>
    </>
  );
}
