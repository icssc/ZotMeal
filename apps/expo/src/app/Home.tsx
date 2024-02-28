
import { Pin, PinOff, StarFull } from '@tamagui/lucide-icons';
import type { Dish, Station } from '@zotmeal/db';
import { Link } from 'expo-router';
import {
  Button,
  H3,
  H5,
  Image,
  ListItem,
  Separator,
  SizableText,
  Tabs,
  View,
  XStack,
  YGroup,
  YStack
} from 'tamagui';

// TODO: Replace with real user data
const dummyUserPins = ["312"];

// TODO: Replace with real data
const brandywineData = {
  date: "1/22/2022",
  period: "breakfast",
  restaurant: "brandywine",
  stations: [
    {
      id: "111",
      name: "Honeycakes/Bakery",
      categories: [
        {
          name: "Desserts",
          dishes: [
            {
              name: "Blueberry Scone",
              id: "123",
              description: "Item Description",
              nutritionInfo: {
                calories: "300",
                dietaryFiber: "2g",
                protein: "10g",
                sugars: "5g",
                totalCarbohydrates: "30g",
                totalFat: "15g",
                transFat: "0g",
                saturatedFat: "5g",
                sodium: "300mg",
                cholesterol: "50mg",
                vitaminA: "10%",
                vitaminC: "10%",
                calcium: "10%",
                iron: "10%",
              },
            },
            {
              name: "Breakfast Muffin",
              id: "312",
              description: "Item Description",
              nutritionInfo: {
                calories: "300",
                dietaryFiber: "2g",
                protein: "10g",
                sugars: "5g",
                totalCarbohydrates: "30g",
                totalFat: "15g",
                transFat: "0g",
                saturatedFat: "5g",
                sodium: "300mg",
                cholesterol: "50mg",
                vitaminA: "10%",
                vitaminC: "10%",
                calcium: "10%",
                iron: "10%",
              },
            },
          ],
        },
        {
          name: "Sides",
          dishes: [
            {
              name: "Side 1",
              id: "444",
              description: "Item Description",
              nutritionInfo: {
                calories: "300",
                dietaryFiber: "2g",
                protein: "10g",
                sugars: "5g",
                totalCarbohydrates: "30g",
                totalFat: "15g",
                transFat: "0g",
                saturatedFat: "5g",
                sodium: "300mg",
                cholesterol: "50mg",
                vitaminA: "10%",
                vitaminC: "10%",
                calcium: "10%",
                iron: "10%",
              },
            },
            {
              name: "Side 2",
              id: "555",
              description: "Item Description",
              nutritionInfo: {
                calories: "300",
                dietaryFiber: "2g",
                protein: "10g",
                sugars: "5g",
                totalCarbohydrates: "30g",
                totalFat: "15g",
                transFat: "0g",
                saturatedFat: "5g",
                sodium: "300mg",
                cholesterol: "50mg",
                vitaminA: "10%",
                vitaminC: "10%",
                calcium: "10%",
                iron: "10%",
              },
            },
          ],
        },
      ],
    },
    {
      id: "222",
      name: "Hearth/Pizza",
      categories: [
        {
          name: "Entrees",
          dishes: [
            {
              name: "Blueberry Scone",
              id: "123",
              description: "Item Description",
              nutritionInfo: {
                calories: "300",
                dietaryFiber: "2g",
                protein: "10g",
                sugars: "5g",
                totalCarbohydrates: "30g",
                totalFat: "15g",
                transFat: "0g",
                saturatedFat: "5g",
                sodium: "300mg",
                cholesterol: "50mg",
                vitaminA: "10%",
                vitaminC: "10%",
                calcium: "10%",
                iron: "10%",
              },
              dietRestriction: {
                isVegan: true,
                isVegetarian: true,
                isGlutenFree: true,
                isHalal: true,
              },
            },
            {
              name: "Breakfast Muffin",
              id: "312",
              description: "Item Description",
              nutritionInfo: {
                calories: "300",
                dietaryFiber: "2g",
                protein: "10g",
                sugars: "5g",
                totalCarbohydrates: "30g",
                totalFat: "15g",
                transFat: "0g",
                saturatedFat: "5g",
                sodium: "300mg",
                cholesterol: "50mg",
                vitaminA: "10%",
                vitaminC: "10%",
                calcium: "10%",
                iron: "10%",
              },
              dietRestriction: {
                isVegan: true,
                isVegetarian: true,
                isGlutenFree: true,
                isHalal: true,
              },
            },
          ],
        },
      ],
    },
  ]
};

// TODO: Replace with real data
const anteateryData = {
  date: "1/22/2022",
  period: "breakfast",
  restaurant: "anteatery",
  stations: [
    {
      id: "111",
      name: "Oven",
      categories: [
        {
          name: "Entrees",
          dishes: [
            {
              name: "Blueberry Scone",
              id: "123",
              description: "Item Description",
              nutritionInfo: {
                calories: "300",
                dietaryFiber: "2g",
                protein: "10g",
                sugars: "5g",
                totalCarbohydrates: "30g",
                totalFat: "15g",
                transFat: "0g",
                saturatedFat: "5g",
                sodium: "300mg",
                cholesterol: "50mg",
                vitaminA: "10%",
                vitaminC: "10%",
                calcium: "10%",
                iron: "10%",
              },
            },
            {
              name: "Breakfast Muffin",
              id: "312",
              description: "Item Description",
              nutritionInfo: {
                calories: "300",
                dietaryFiber: "2g",
                protein: "10g",
                sugars: "5g",
                totalCarbohydrates: "30g",
                totalFat: "15g",
                transFat: "0g",
                saturatedFat: "5g",
                sodium: "300mg",
                cholesterol: "50mg",
                vitaminA: "10%",
                vitaminC: "10%",
                calcium: "10%",
                iron: "10%",
              },
            },
          ],
        },
        {
          name: "Sides",
          dishes: [
            {
              name: "Side 1",
              id: "444",
              description: "Item Description",
              nutritionInfo: {
                calories: "300",
                dietaryFiber: "2g",
                protein: "10g",
                sugars: "5g",
                totalCarbohydrates: "30g",
                totalFat: "15g",
                transFat: "0g",
                saturatedFat: "5g",
                sodium: "300mg",
                cholesterol: "50mg",
                vitaminA: "10%",
                vitaminC: "10%",
                calcium: "10%",
                iron: "10%",
              },
            },
            {
              name: "Side 2",
              id: "555",
              description: "Item Description",
              nutritionInfo: {
                calories: "300",
                dietaryFiber: "2g",
                protein: "10g",
                sugars: "5g",
                totalCarbohydrates: "30g",
                totalFat: "15g",
                transFat: "0g",
                saturatedFat: "5g",
                sodium: "300mg",
                cholesterol: "50mg",
                vitaminA: "10%",
                vitaminC: "10%",
                calcium: "10%",
                iron: "10%",
              },
            },
          ],
        },
      ],
    },
    {
      id: "222",
      name: "Hearth/Pizza",
      categories: [
        {
          name: "Bakery",
          dishes: [
            {
              name: "Blueberry Scone",
              id: "123",
              description: "Item Description",
              nutritionInfo: {
                calories: "300",
                dietaryFiber: "2g",
                protein: "10g",
                sugars: "5g",
                totalCarbohydrates: "30g",
                totalFat: "15g",
                transFat: "0g",
                saturatedFat: "5g",
                sodium: "300mg",
                cholesterol: "50mg",
                vitaminA: "10%",
                vitaminC: "10%",
                calcium: "10%",
                iron: "10%",
              },
              dietRestriction: {
                isVegan: true,
                isVegetarian: true,
                isGlutenFree: true,
                isHalal: true,
              },
            },
            {
              name: "Breakfast Muffin",
              id: "312",
              description: "Item Description",
              nutritionInfo: {
                calories: "300",
                dietaryFiber: "2g",
                protein: "10g",
                sugars: "5g",
                totalCarbohydrates: "30g",
                totalFat: "15g",
                transFat: "0g",
                saturatedFat: "5g",
                sodium: "300mg",
                cholesterol: "50mg",
                vitaminA: "10%",
                vitaminC: "10%",
                calcium: "10%",
                iron: "10%",
              },
              dietRestriction: {
                isVegan: true,
                isVegetarian: true,
                isGlutenFree: true,
                isHalal: true,
              },
            },
          ],
        },
      ],
    },
  ]
};

export const Home = () => (
  <RestaurantTabs
    brandywineData={brandywineData}
    anteateryData={anteateryData}
  />
);

function RestaurantTabs({ brandywineData, anteateryData }: {
  brandywineData: any[],
  anteateryData: any[],
}) {
  return (
    <Tabs
      defaultValue="brandywine"
      orientation="horizontal"
      flexDirection="column"
      width={"100%"}
      height={"100%"}
    >
      <Tabs.List
        borderRadius={"$20"}
        separator={<Separator vertical />}
        disablePassBorderRadius="bottom"
        flexDirection='column'
        zIndex={1}
      >
        <View width={"100%"} flexDirection='row'>
          <Tabs.Tab flex={1} value="brandywine">
            <H3 fontWeight={"bold"}>Brandywine</H3>
          </Tabs.Tab>
          <Tabs.Tab flex={1} value="anteatery">
            <H3 fontWeight={"bold"}>The Anteatery</H3>
          </Tabs.Tab>
        </View>
      </Tabs.List>


      {[brandywineData, anteateryData].map((data) => (
        <Tabs.Content
          key={data.restaurant}
          value={data.restaurant}
          alignItems="center"
          flex={1}
        >
          {/* TODO: Format the image similar to Figma design */}
          <Image
            source={{
              uri: data.restaurant === "brandywine" ?
                "https://s3-media0.fl.yelpcdn.com/bphoto/P0DIhR8cO-JxYygc3V3aaQ/348s.jpg" :
                "https://images.rsmdesign.com/7321bb55-579f-47fd-9f27-a6abf3e9826e.jpg"
            }}
            position="absolute"
            width={"100%"}
            height={100}
          />
          <View height={100}></View>
          <YStack gap="$5" width={"100%"} padding="$2">
            <XStack gap="$5" width={"100%"} justifyContent='center'>
              <H5>{data.period}</H5>
              <H5>{data.date}</H5>
            </XStack>
            <StationTabs stations={data.stations} />
          </YStack>
        </Tabs.Content>
      ))}
    </Tabs>
  )
}

const StationTabs = ({ stations }: { stations: Station[] }) => (
  <Tabs
    defaultValue={stations[0].name}
    orientation="horizontal"
    flexDirection="column"
    width={"100%"}
    height={"100%"}
  >
    <Tabs.List
      gap="$5"
      padding="$2"
    >
      {stations.map((station) => (
        <Tabs.Tab
          key={station.name}
          flex={1}
          value={station.name}
          borderRadius={10}
          height={"100%"}
        >
          <SizableText>{station.name}</SizableText>
        </Tabs.Tab>
      ))}
    </Tabs.List>

    {stations.map((station) => (
      <Tabs.Content
        key={station.name}
        value={station.name}
        padding="$2"
        alignItems="center"
        flex={1}
      >
        {station.categories.map((category) => (
          <Category category={category} key={category.name} />
        ))}
      </Tabs.Content>
    ))}
  </Tabs>
);

// TODO: Refactor menu schema to have a 'categories' field and update below accordingly
const Category = ({ category: { name, dishes } }: {
  category: {
    name: string,
    dishes: Dish[],
  }
}) => (
  <YStack key={name} width={"100%"}>
    <H3 fontWeight={'bold'}>{name}</H3>
    <YGroup bordered separator={<Separator borderWidth={1} />}>
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} />
      ))}
    </YGroup>
  </YStack>
)

const DishCard = ({ dish }: { dish: Dish }) => (
  <YGroup.Item>
    <Link
      asChild
      href={{
        pathname: "/item/[id]",
        params: { id: dish.id },
      }}
    >
      <ListItem pressTheme>
        <XStack>
          <XStack gap="25">
            <Image
              resizeMode="contain"
              alignSelf="center"
              width={50}
              height={50}
              source={{
                uri: 'https://images.rawpixel.com/image_png_1100/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTExL2ZyZWVpbWFnZXNjb21wYW55X3Bob3RvX29mX2Nob2NvbGF0ZV9jaGlwX2Nvb2tpZV90b3Bfdmlld19pc29sYV8xOGVkY2ZiYS00ZTJjLTQ5MWItYjZiOC02ZGZjNmY1M2Y0OWIucG5n.png',
              }}
            />
            <YStack gap="$1" width={"40%"}>
              <SizableText fontWeight={"bold"}>{dish.name}</SizableText>
              <SizableText><StarFull /> 5.0</SizableText>
            </YStack>
            <YStack gap="$1">
              <SizableText>{dish.nutritionInfo.calories} cal</SizableText>
              {dummyUserPins.includes(dish.id) ?
                <Button>Unpin <PinOff /></Button> :
                <Button>Pin <Pin /></Button>
              }
            </YStack>
          </XStack>
        </XStack>
      </ListItem>
    </Link>
  </YGroup.Item>
)
