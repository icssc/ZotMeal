import { Redirect, Stack, useGlobalSearchParams } from "expo-router";
import { Button, H3, H4, Image, ScrollView, Separator, Text, View, XStack, YStack, useTheme } from "tamagui";
import RateItem from "./RateItem";
import { useMenuStore } from "..";
import { ChevronRight, Pin } from "@tamagui/lucide-icons";
import type { DishWithRelations } from "@zotmeal/db/src/schema";


export default function MenuItem() {
  const theme = useTheme();
  const { id, stationId } = useGlobalSearchParams();

  if (!id || typeof id !== "string") throw new Error("unreachable");
  if (!stationId || typeof stationId !== "string") throw new Error("unreachable");

  const {
    selectedRestaurant,
    anteateryMenu,
    brandywineMenu,
  } = useMenuStore();

  const menu = selectedRestaurant === "anteatery" ? anteateryMenu : brandywineMenu;

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

  function NutritionFacts({ dish }: { dish: DishWithRelations; }) {
    return (
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
          <Text fontWeight={"800"}>{dish.nutritionInfo.servingSize}{dish.nutritionInfo.servingUnit}</Text>
        </XStack>
        <Separator marginVertical="$2" borderWidth={7} />
        <Text>Amount per serving</Text>
        <XStack justifyContent="space-between">
          <H4>Calories</H4>
          <H4>{dish.nutritionInfo.calories}</H4>
        </XStack>
        <Separator marginVertical="$2" borderWidth={4} />
        {/* TODO: Add % Daily Value */}
        {/* <Text>% Daily Value*</Text> */}
        <Text><Text fontWeight={"800"}>Total Fat</Text> {dish.nutritionInfo.totalFat}</Text>
        <Separator marginVertical="$2" borderWidth={1} />
        <Text paddingLeft="$4">Saturated Fat {dish.nutritionInfo.saturatedFat}</Text>
        <Separator marginVertical="$2" borderWidth={1} />
        <Text paddingLeft="$4">Trans Fat {dish.nutritionInfo.transFat}</Text>
        <Separator marginVertical="$2" borderWidth={1} />
        <Text><Text fontWeight={"800"}>Cholesterol</Text> {dish.nutritionInfo.cholesterol}</Text>
        <Separator marginVertical="$2" borderWidth={1} />
        <Text><Text fontWeight={"800"}>Sodium</Text> {dish.nutritionInfo.sodium}</Text>
        <Separator marginVertical="$2" borderWidth={1} />
        <Text><Text fontWeight={"800"}>Total Carbohydrates</Text> {dish.nutritionInfo.totalCarbohydrates}</Text>
        <Separator marginVertical="$2" borderWidth={1} />
        <Text paddingLeft="$4">Dietary Fiber {dish.nutritionInfo.dietaryFiber}</Text>
        <Separator marginVertical="$2" borderWidth={1} />
        <Text paddingLeft="$4">Sugars {dish.nutritionInfo.sugars}</Text>
        <Separator marginVertical="$2" borderWidth={1} />
        <Text><Text fontWeight={"800"}>Sodium</Text> {dish.nutritionInfo.protein}</Text>
        <Separator marginVertical="$2" borderWidth={7} />
        <XStack justifyContent="space-between">
          <Text>Vitamin A</Text>
          <Text>{dish.nutritionInfo.vitaminA}</Text>
        </XStack>
        <Separator marginVertical="$2" borderWidth={1} />
        <XStack justifyContent="space-between">
          <Text>Vitamin C</Text>
          <Text>{dish.nutritionInfo.vitaminC}</Text>
        </XStack>
        <Separator marginVertical="$2" borderWidth={1} />
        <XStack justifyContent="space-between">
          <Text>Iron</Text>
          <Text>{dish.nutritionInfo.iron}</Text>
        </XStack>
        <Separator marginVertical="$2" borderWidth={1} />
        <XStack justifyContent="space-between">
          <Text>Calcium</Text>
          <Text>{dish.nutritionInfo.calcium}</Text>
        </XStack>
        <Separator marginVertical="$2" borderWidth={4} />
        <Text>The % Daily Value tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.</Text>
      </YStack>
    );
  }

  return (
    <>
      <Stack.Screen options={{
        headerTitle: dish.name,
        headerBackTitle: "Home",
        headerTitleStyle: { color: "#FFFFFF" }
      }} />
      <ScrollView height={"100%"} width={"100%"}>
        <Image
          source={{
            uri: "https://images.rawpixel.com/image_png_1100/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTExL2ZyZWVpbWFnZXNjb21wYW55X3Bob3RvX29mX2Nob2NvbGF0ZV9jaGlwX2Nvb2tpZV90b3Bfdmlld19pc29sYV8xOGVkY2ZiYS00ZTJjLTQ5MWItYjZiOC02ZGZjNmY1M2Y0OWIucG5n.png"
          }}
          width={"100%"}
          height={200}
        />

        <View padding="$4">
          <XStack alignItems="center">
            <Text fontSize={"$5"} color={"gray"}>{selectedRestaurant.charAt(0).toUpperCase() + selectedRestaurant.slice(1)}</Text>
            <ChevronRight color={"gray"} />
            <Text fontSize={"$5"} color={"gray"}>{station.name}</Text>
          </XStack>
          <H3>{dish.name ?? "No name found"}</H3>
          <Text>{dish.description ?? "No description found."}</Text>
          <XStack justifyContent="space-between" paddingVertical="$4">
            <RateItem item={dish} />
            <Button borderRadius="$10" paddingHorizontal="$4" fontWeight={"800"}>Pin <Pin /></Button>
          </XStack>
          <NutritionFacts dish={dish} />

          <Image // nutrition label for reference
            resizeMode="contain"
            width={"100%"}
            height={500}
            source={{
              uri: "https://www.fda.gov/files/NFL-NewLabel-900x900_0.png"
            }}
          />
        </View>

      </ScrollView>
    </>
  );
}
