import { Redirect, Stack, useGlobalSearchParams } from "expo-router";
import { ChevronRight } from "@tamagui/lucide-icons";
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

import type { NutritionInfo } from "@zotmeal/db";

import { PinButton } from "~/components";
import { useMenuStore } from "~/utils";
import RateItem from "./RateItem";

export default function MenuItem() {
  const theme = useTheme();
  const { id, stationId } = useGlobalSearchParams();

  if (!id || typeof id !== "string")
    throw new Error("unreachable: id is not a string");
  if (!stationId || typeof stationId !== "string")
    throw new Error("unreachable: stationId is not a string");

  const { selectedRestaurant, anteateryMenu, brandywineMenu } = useMenuStore();

  const menu =
    selectedRestaurant === "anteatery" ? anteateryMenu : brandywineMenu;

  // TODO: Log error if menu is not found
  if (!menu) return <Redirect href="/home/" />;

  const station = menu.stations.find((station) => station.id === stationId);

  // TODO: Log error if station is not found
  if (!station) return <Redirect href="/home/" />;

  const dish = station.dishes.find((dish) => dish.id === id);

  // TODO: Log error if dish is not found
  if (!dish) return <Redirect href="/home/" />;

  // Unused fields:
  // caloriesFromFat

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
      alignSelf="center"
    >
      <H3>Nutrition Facts</H3>
      <Separator marginVertical="$2" borderWidth={1} />
      <XStack justifyContent="space-between">
        <Text fontWeight={"800"}>Serving Size</Text>
        <Text fontWeight={"800"}>
          {nutritionInfo.servingSize}
          {nutritionInfo.servingUnit}
        </Text>
      </XStack>
      <Separator marginVertical="$2" borderWidth={7} />
      <Text>Amount per serving</Text>
      <XStack justifyContent="space-between">
        <H4>Calories</H4>
        <H4>{nutritionInfo.calories}</H4>
      </XStack>
      <Separator marginVertical="$2" borderWidth={4} />
      {/* TODO: Add % Daily Value */}
      {/* <Text>% Daily Value*</Text> */}
      <Text>
        <Text fontWeight={"800"}>Total Fat</Text> {nutritionInfo.totalFatG}g
      </Text>
      <Separator marginVertical="$2" borderWidth={1} />
      <Text paddingLeft="$4">Saturated Fat {nutritionInfo.saturatedFatG}g</Text>
      <Separator marginVertical="$2" borderWidth={1} />
      <Text paddingLeft="$4">Trans Fat {nutritionInfo.transFatG}g</Text>
      <Separator marginVertical="$2" borderWidth={1} />
      <Text>
        <Text fontWeight={"800"}>Cholesterol</Text>{" "}
        {nutritionInfo.cholesterolMg}
      </Text>
      <Separator marginVertical="$2" borderWidth={1} />
      <Text>
        <Text fontWeight={"800"}>Sodium</Text> {nutritionInfo.sodiumMg}mg
      </Text>
      <Separator marginVertical="$2" borderWidth={1} />
      <Text>
        <Text fontWeight={"800"}>Total Carbohydrates</Text>{" "}
        {nutritionInfo.totalCarbsG}g
      </Text>
      <Separator marginVertical="$2" borderWidth={1} />
      <Text paddingLeft="$4">Dietary Fiber {nutritionInfo.dietaryFiberG}g</Text>
      <Separator marginVertical="$2" borderWidth={1} />
      <Text paddingLeft="$4">Sugars {nutritionInfo.sugarsMg}mg</Text>
      <Separator marginVertical="$2" borderWidth={1} />
      <Text>
        <Text fontWeight={"800"}>Sodium</Text> {nutritionInfo.proteinG}g
      </Text>
      <Separator marginVertical="$2" borderWidth={7} />
      <XStack justifyContent="space-between">
        <Text>Vitamin A {nutritionInfo.vitaminAIU} IU</Text>
        <Text></Text>
      </XStack>
      <Separator marginVertical="$2" borderWidth={1} />
      <XStack justifyContent="space-between">
        <Text>Vitamin C {nutritionInfo.vitaminCIU} IU</Text>
        <Text></Text>
      </XStack>
      <Separator marginVertical="$2" borderWidth={1} />
      <XStack justifyContent="space-between">
        <Text>Iron {nutritionInfo.ironMg}mg</Text>
        <Text></Text>
      </XStack>
      <Separator marginVertical="$2" borderWidth={1} />
      <XStack justifyContent="space-between">
        <Text>Calcium {nutritionInfo.calciumMg}mg</Text>
        <Text></Text>
      </XStack>
      <Separator marginVertical="$2" borderWidth={4} />
      <Paragraph>
        The % Daily Value tells you how much a nutrient in a serving of food
        contributes to a daily diet. 2,000 calories a day is used for general
        nutrition advice.
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
      <ScrollView
        height={"100%"}
        width={"100%"}
        contentInset={{
          bottom: 100,
        }}
      >
        <Image
          source={{
            uri: "https://images.rawpixel.com/image_png_1100/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTExL2ZyZWVpbWFnZXNjb21wYW55X3Bob3RvX29mX2Nob2NvbGF0ZV9jaGlwX2Nvb2tpZV90b3Bfdmlld19pc29sYV8xOGVkY2ZiYS00ZTJjLTQ5MWItYjZiOC02ZGZjNmY1M2Y0OWIucG5n.png",
          }}
          width={"100%"}
          height={200}
        />

        <View padding="$4">
          <XStack alignItems="center">
            <Text fontSize={"$5"} color={"gray"}>
              {selectedRestaurant.charAt(0).toUpperCase() +
                selectedRestaurant.slice(1)}
            </Text>
            <ChevronRight color={"gray"} />
            <Text fontSize={"$5"} color={"gray"}>
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
      </ScrollView>
    </>
  );
}
