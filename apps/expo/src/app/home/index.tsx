
import DateTimePicker from '@react-native-community/datetimepicker';
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Pin, PinOff, StarFull } from '@tamagui/lucide-icons';
import { ID_TO_RESTAURANT, PERIOD_TO_ID, getCurrentPeriodName, getRestaurantNameById } from '@zotmeal/utils';
import { Link } from 'expo-router';
import {
  Button,
  H3,
  Image,
  ListItem,
  ScrollView,
  Separator,
  SizableText,
  Tabs,
  Text,
  View,
  XStack,
  YGroup,
  YStack
} from 'tamagui';
import { anteateryData, brandywineData } from './example_data';
import { useTheme } from 'tamagui';
import type { MenuWithRelations } from '@zotmeal/db/src/schema';
import { create } from 'zustand';
// import { api } from '~/utils/api';
import { useEffect, useState } from 'react';

type Station = MenuWithRelations["stations"][0];
type Dish = MenuWithRelations["stations"][0]["dishes"][0];
type RestaurantName = NonNullable<ReturnType<typeof getRestaurantNameById>>;

// TODO: Replace with real user data
const dummyUserPins = ["312"];

interface MenuState {
  selectedRestaurant: RestaurantName;
  anteateryMenu: MenuWithRelations | null;
  brandywineMenu: MenuWithRelations | null;
  setSelectedRestaurant: (restaurant: RestaurantName) => void;
  setAnteateryMenu: (anteateryMenu: MenuWithRelations) => void;
  setBrandywineMenu: (brandywineMenu: MenuWithRelations) => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  selectedRestaurant: "brandywine",
  anteateryMenu: anteateryData,
  brandywineMenu: brandywineData,
  // anteateryMenu: null,
  // brandywineMenu: null,
  setSelectedRestaurant: (selectedRestaurant: RestaurantName) => set({ selectedRestaurant }),
  setAnteateryMenu: (anteateryMenu: MenuWithRelations) => set({ anteateryMenu }),
  setBrandywineMenu: (brandywineMenu: MenuWithRelations) => set({ brandywineMenu }),
}));

export function Home() {
  const { selectedRestaurant } = useMenuStore();

  return (
    <>
      <Image
        source={{
          uri: selectedRestaurant === "brandywine" ?
            "https://s3-media0.fl.yelpcdn.com/bphoto/P0DIhR8cO-JxYygc3V3aaQ/348s.jpg" :
            "https://images.rsmdesign.com/7321bb55-579f-47fd-9f27-a6abf3e9826e.jpg"
        }}
        position='absolute'
        zIndex={-1}
        width={"100%"}
        height={100}
      />
      <View height={80} />
      <RestaurantTabs />
    </>
  );
};


function RestaurantTabs() {
  const {
    selectedRestaurant,
    anteateryMenu,
    brandywineMenu,
    setSelectedRestaurant,
    setAnteateryMenu,
    setBrandywineMenu,
  } = useMenuStore();

  // const anteateryMenu = anteateryData;
  // const brandywineMenu = brandywineData;

  const [date, setDate] = useState(new Date());
  const [periodName, setPeriodName] = useState(getCurrentPeriodName());
  // const [anteateryMenu, brandywineMenu] = api.useQueries((t) =>
  //   (["anteatery", "brandywine"] as const).map((restaurantName) =>
  //     t.menu.get({
  //       date: date.toLocaleDateString("en-US"),
  //       periodName,
  //       restaurantName,
  //     })));

  // useEffect(() => {
  //   if (anteateryMenu?.data) {
  //     setAnteateryMenu(anteateryMenu.data);
  //   }

  //   if (brandywineMenu?.data) {
  //     setBrandywineMenu(brandywineMenu.data);
  //   }
  // }, [anteateryMenu, brandywineMenu, setAnteateryMenu, setBrandywineMenu]);

  const theme = useTheme();

  // TODO: Could be better, maybe loading spinner
  if (!anteateryMenu || !brandywineMenu) {
    return <View>Loading...</View>;
  }

  // if (anteateryMenu.isLoading || brandywineMenu.isLoading) {
  //   return <View>Loading...</View>;
  // }

  // if (anteateryMenu.isError || brandywineMenu.isError || !anteateryMenu.data || !brandywineMenu.data) {
  //   return <View>Error: {anteateryMenu.error ?? brandywineMenu.error}</View>;
  // }

  const PeriodPicker = ({ color }: { color: string }) => (
    <Picker
      style={{
        width: 150,
      }}
      itemStyle={{
        height: 50,
        paddingVertical: 50,
        fontSize: 18,
        color,
      }}
      selectedValue={periodName}
      onValueChange={(itemValue, _) =>
        setPeriodName(itemValue)
      }
    >
      {/* Create a Picker.Item for each period */}
      {Object.entries(PERIOD_TO_ID).map(([period, id]) => (
        <Picker.Item
          key={id}
          label={period}
          value={id}
        />
      ))}
    </Picker>
  );

  return (
    <Tabs
      value={selectedRestaurant}
      onValueChange={(value) => setSelectedRestaurant(value as RestaurantName)}
      orientation="horizontal"
      flexDirection="column"
      width={"100%"}
      height={"100%"}
    >
      <Tabs.List
        borderRadius={"$10"}
        // separator={<Separator vertical />}
        disablePassBorderRadius="bottom"
        flexDirection='column'
      >
        <View width={"100%"} flexDirection='row'>
          <Tabs.Tab flex={1} value="brandywine">
            <H3 fontWeight={"800"}>Brandywine</H3>
          </Tabs.Tab>
          <Tabs.Tab flex={1} value="anteatery">
            <H3 fontWeight={"800"}>The Anteatery</H3>
          </Tabs.Tab>
        </View>
      </Tabs.List>


      {/* {[brandywineMenu.data, anteateryMenu.data].map((menu) => ( */}
      {[brandywineMenu, anteateryMenu].map((menu) => (
        <Tabs.Content
          key={menu.restaurantId}
          value={getRestaurantNameById(menu.restaurantId as keyof typeof ID_TO_RESTAURANT)!}
          alignItems="center"
          flex={1}
        >
          <YStack gap="$5" width={"100%"} padding="$2">
            <XStack width={"100%"} justifyContent='space-between'>
              <PeriodPicker color={theme.color?.val as string} />
              {/* TODO: Write a unit test for rendering and checking if onChange is triggered on event */}
              <DateTimePicker
                value={date}
                mode="date"
                onChange={(event: DateTimePickerEvent, selectedDate) => {
                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }}
              />
            </XStack>
            <StationTabs stations={menu.stations} />
          </YStack>
        </Tabs.Content>
      ))}
    </Tabs>
  )
}

const StationTabs = ({ stations }: {
  stations: Station[],
}) => (
  <Tabs
    defaultValue={stations?.[0]?.name}
    orientation="horizontal"
    flexDirection="column"
    width={"100%"}
    height={"100%"}
  >
    <Tabs.List>
      <ScrollView
        horizontal
        bounces={false} // Disable bounce for the tabs
      >
        {stations.map((station) => (
          <Tabs.Tab
            key={station.name}
            flex={1}
            value={station.name}
            borderRadius="$10"
            height={"$3"}
            marginHorizontal="$1"
            marginBottom="$3"
          >
            <Text fontSize={"$5"}>{station.name}</Text>
          </Tabs.Tab>
        ))}
      </ScrollView>
    </Tabs.List>

    {stations.map((station) => (
      <Tabs.Content
        key={station.name}
        value={station.name}
      >
        <ScrollView
          padding="$2"
          contentContainerStyle={{
            alignItems: "center",
          }}
          contentInset={{
            top: 0,
            bottom: 200, // Make space at the bottom of the ScrollView
          }}
        >
          {/* group dishes by category */}
          {Object
            .entries(groupBy(station.dishes, dish => dish.category as keyof Dish))
            .map(([category, dishes]) => (
              <Category key={category} category={category} dishes={dishes} />
            ))}
        </ScrollView>
      </Tabs.Content>
    ))}
  </Tabs>
);

const groupBy = <T, K extends keyof T>(arr: T[], key: (i: T) => K) =>
  arr.reduce((groups, item) => {
    (groups[key(item)] ||= []).push(item);
    return groups;
  }, {} as Record<K, T[]>);

const Category = ({ category, dishes }: {
  category: string,
  dishes: Dish[],
}) => (
  <YStack key={category} width={"100%"}>
    <H3 fontWeight={"800"} marginTop="$5">{category}</H3>
    <YGroup bordered separator={<Separator borderWidth={1} />}>
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} />
      ))}
    </YGroup>
  </YStack>
)

const DishCard = ({ dish }: {
  dish: Dish,
}) => (
  <YGroup.Item>
    <Link
      asChild
      href={{
        pathname: "/home/item/[id]",
        params: { id: dish.id, stationId: dish.stationId },
      }}
    >
      <ListItem pressTheme>
        <XStack justifyContent='space-between'>
          <Image
            resizeMode="contain"
            alignSelf="center"
            width={50}
            height={50}
            marginRight="$1"
            source={{
              uri: 'https://images.rawpixel.com/image_png_1100/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTExL2ZyZWVpbWFnZXNjb21wYW55X3Bob3RvX29mX2Nob2NvbGF0ZV9jaGlwX2Nvb2tpZV90b3Bfdmlld19pc29sYV8xOGVkY2ZiYS00ZTJjLTQ5MWItYjZiOC02ZGZjNmY1M2Y0OWIucG5n.png',
            }}
          />
          <YStack gap="$1" width={"85%"} justifyContent='space-between' paddingVertical="$3" borderWidth={1} borderColor={"red"}>
            <XStack justifyContent='space-between'>
              <SizableText fontWeight={"800"} fontSize={"$5"} borderWidth={1} borderColor={"red"}>{dish.name}</SizableText>
              <SizableText textAlign='right' fontSize="$5" borderWidth={1} borderColor={"red"}>{dish.nutritionInfo.calories} cal</SizableText>
            </XStack>
            <XStack justifyContent='space-between' borderWidth={1} borderColor={"red"}>
              <XStack alignItems='center' gap="$1" borderWidth={1} borderColor={"red"} width={"70%"}>
                <StarFull color="gold" scale={0.8} />
                <Text><Text fontWeight="800" fontSize="$4">5.0</Text> <Text>(10,000 reviews)</Text></Text>
              </XStack>
              {dummyUserPins.includes(dish.id) ?
                <Button scale={0.8} fontWeight={"800"}>Unpin <PinOff /></Button> :
                <Button scale={0.8} fontWeight={"800"}>Pin <Pin /></Button>
              }
            </XStack>
          </YStack>
        </XStack>
      </ListItem>
    </Link>
  </YGroup.Item>
)
