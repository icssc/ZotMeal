import { Link } from "expo-router";
import { StarFull } from "@tamagui/lucide-icons";
import { Image, ListItem, Text, XStack, YGroup, YStack } from "tamagui";

import type { MenuWithRelations } from "@zotmeal/db";

import { PinButton } from "~/components";

type Station = MenuWithRelations["stations"][0];
type Dish = MenuWithRelations["stations"][0]["dishes"][0];

export const DishCard = ({
  dish,
  stationId,
}: Readonly<{
  dish: Dish;
  stationId: Station["id"];
}>) => (
  <YGroup.Item>
    <Link
      asChild
      href={{
        pathname: "/home/item/[id]",
        params: {
          id: dish.id,
          stationId,
        },
      }}
    >
      <ListItem pressTheme>
        <XStack justifyContent="space-between" paddingRight="$4">
          <Image
            resizeMode="contain"
            alignSelf="center"
            width="18%"
            height={65}
            marginRight="$3"
            source={{
              uri: "https://images.rawpixel.com/image_png_1100/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTExL2ZyZWVpbWFnZXNjb21wYW55X3Bob3RvX29mX2Nob2NvbGF0ZV9jaGlwX2Nvb2tpZV90b3Bfdmlld19pc29sYV8xOGVkY2ZiYS00ZTJjLTQ5MWItYjZiOC02ZGZjNmY1M2Y0OWIucG5n.png",
            }}
          />
          <YStack
            gap="$1"
            width={"75%"}
            justifyContent="space-between"
            paddingTop="$4"
            paddingBottom="$3"
          >
            <XStack justifyContent="space-between">
              <Text fontWeight={"800"} fontSize={"$5"}>
                {dish.name}
              </Text>
              <Text textAlign="right" fontSize="$5" fontWeight={"800"}>
                {dish.nutritionInfo.calories} cal
              </Text>
            </XStack>
            <XStack justifyContent="space-between">
              <XStack alignItems="center" gap="$1" width={"70%"}>
                <StarFull color="gold" scale={0.8} />
                <Text>
                  <Text fontWeight="800" fontSize="$4">
                    5.0
                  </Text>{" "}
                  <Text color="gray">(10,000 reviews)</Text>
                </Text>
              </XStack>
              <PinButton
                dishName={dish.name}
                scale={0.8}
                minWidth="48%"
                borderRadius="$10"
                fontWeight="800"
              />
            </XStack>
          </YStack>
        </XStack>
      </ListItem>
    </Link>
  </YGroup.Item>
);
