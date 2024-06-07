import { Link } from "expo-router";
import { StarFull } from "@tamagui/lucide-icons";
import { Image, ListItem, Text, View, XStack, YGroup, YStack } from "tamagui";

import type { MenuWithRelations } from "@zotmeal/db";

import { PinButton } from "~/components";
import { testDishImages } from "../../../components/menu/testDishImages";

type Station = MenuWithRelations["stations"][0];
type Dish = MenuWithRelations["stations"][0]["dishes"][0];

export const DishCard = ({
  dish,
  stationId,
}: Readonly<{
  dish: Dish;
  stationId: Station["id"];
}>) => (
  <XStack height={100}>
    <Image
      objectFit="cover"
      alignSelf="center"
      width={100}
      height="90%"
      borderRadius={5}
      source={{
        uri: testDishImages[Math.floor(Math.random() * testDishImages.length)],
      }}
    />
    <View width={15} />
    <YGroup.Item>
      <Link
        asChild
        href={{
          pathname: "/item/[id]",
          params: {
            id: dish.id,
            stationId,
          },
        }}
      >
        <ListItem pressTheme width="85%">
          <YStack gap="$1" paddingTop="$4" paddingBottom="$3">
            <XStack justifyContent="space-between" width="100%">
              <View>
                <Text fontWeight="800" fontSize="$5">
                  {dish.name}
                </Text>
              </View>
              <View>
                <Text textAlign="right" fontSize="$5" fontWeight="800">
                  {dish.nutritionInfo.calories
                    ? `${dish.nutritionInfo.calories} cal`
                    : ""}
                </Text>
              </View>
            </XStack>
            <XStack justifyContent="space-between">
              {dish.totalRating && dish.numRatings ? (
                <XStack alignItems="center" gap="$1" width="70%">
                  <StarFull color="gold" scale={0.8} />
                  <Text>
                    <Text fontWeight="800">
                      {dish.totalRating / dish.numRatings}
                      /5.0
                    </Text>
                    <Text color="gray"> {dish.numRatings ?? "No"} reviews</Text>
                  </Text>
                </XStack>
              ) : (
                <XStack alignItems="center" gap="$1" width="70%">
                  <Text color="gray">No reviews yet</Text>
                </XStack>
              )}
              <PinButton
                dishName={dish.name}
                scale={0.8}
                minWidth="48%"
                borderRadius="$10"
                fontWeight="800"
              />
            </XStack>
          </YStack>
        </ListItem>
      </Link>
    </YGroup.Item>
  </XStack>
);
