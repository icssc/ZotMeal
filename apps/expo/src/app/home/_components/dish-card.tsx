import { Link } from "expo-router";
import { StarFull } from "@tamagui/lucide-icons";
import { Image, ListItem, Text, View, XStack, YGroup, YStack } from "tamagui";

import type { MenuWithRelations } from "@zotmeal/db";

import { PinButton } from "~/components";

type Station = MenuWithRelations["stations"][0];
type Dish = MenuWithRelations["stations"][0]["dishes"][0];

// I just searched up uci food images
const testImages = [
  "https://images.rawpixel.com/image_png_1100/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTExL2ZyZWVpbWFnZXNjb21wYW55X3Bob3RvX29mX2Nob2NvbGF0ZV9jaGlwX2Nvb2tpZV90b3Bfdmlld19pc29sYV8xOGVkY2ZiYS00ZTJjLTQ5MWItYjZiOC02ZGZjNmY1M2Y0OWIucG5n.png",
  "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/d9/0a/d7/uci-dinning-catering.jpg?w=1200&h=-1&s=1",
  "https://scontent.fmkc1-1.fna.fbcdn.net/v/t31.18172-8/22520084_10154933082816651_1596784663010012705_o.jpg?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_ohc=U3N7KJUduSQQ7kNvgE-s-13&_nc_ht=scontent.fmkc1-1.fna&oh=00_AYDS18fCXfgunq--Iq6Ww76VSHJRFszJYKhoYNAnauWbCw&oe=667E4E11",
  "https://i.redd.it/vbf16b42ft1c1.jpg",
  "https://preview.redd.it/why-is-anteatery-breakfast-just-better-than-brandys-v0-8wtwtp7qrlic1.jpeg?width=640&crop=smart&auto=webp&s=1cbb6192f0a8db0911487c9248f8ff0b9b9842e6",
];

export const DishCard = ({
  dish,
  stationId,
}: Readonly<{
  dish: Dish;
  stationId: Station["id"];
}>) => (
  <XStack justifyContent="space-between" height={100}>
    <Image
      resizeMode="cover"
      alignSelf="center"
      width={100}
      height="90%"
      borderRadius={5}
      source={{
        uri: testImages[Math.floor(Math.random() * testImages.length)],
      }}
    />
    <View width={15} />
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
          <YStack gap="$1" paddingTop="$4" paddingBottom="$3">
            <XStack justifyContent="space-between">
              <Text fontWeight="800" fontSize="$5">
                {dish.name}
              </Text>
              <Text textAlign="right" fontSize="$5" fontWeight="800">
                {dish.nutritionInfo.calories} cal
              </Text>
            </XStack>
            <XStack justifyContent="space-between">
              <XStack alignItems="center" gap="$1" width="70%">
                <StarFull color="gold" scale={0.8} />
                <Text>
                  <Text fontWeight="800">5.0</Text>
                  <Text color="gray"> (10,000 reviews)</Text>
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
        </ListItem>
      </Link>
    </YGroup.Item>
  </XStack>
);
