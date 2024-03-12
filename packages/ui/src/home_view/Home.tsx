
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Pin, PinOff, StarFull } from '@tamagui/lucide-icons';
import { PERIOD_TO_ID, getRestaurantNameById } from '@zotmeal/utils';
import { Link } from 'expo-router';
import { useState } from 'react';
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
import { anteateryData, brandywineData } from './example_data';
import type { Dish, Menu, Station } from './query';

// TODO: Replace with real user data
const dummyUserPins = ["312"];

export const Home = () => (
  <RestaurantTabs
    brandywineData={brandywineData}
    anteateryData={anteateryData}
  />
);

function RestaurantTabs({ brandywineData, anteateryData }: {
  brandywineData: Menu,
  anteateryData: Menu,
}) {
  const [period, setPeriod] = useState();
  const [date, setDate] = useState(new Date());

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
          key={data.restaurantId}
          value={getRestaurantNameById(data.restaurantId)!}
          alignItems="center"
          flex={1}
        >
          {/* TODO: Format the image similar to Figma design */}
          <Image
            source={{
              uri: getRestaurantNameById(data.restaurantId) === "brandywine" ?
                "https://s3-media0.fl.yelpcdn.com/bphoto/P0DIhR8cO-JxYygc3V3aaQ/348s.jpg" :
                "https://images.rsmdesign.com/7321bb55-579f-47fd-9f27-a6abf3e9826e.jpg"
            }}
            position="absolute"
            width={"100%"}
            height={100}
          />
          <View height={100} />
          <YStack gap="$5" width={"100%"} padding="$2">
            <XStack width={"100%"} justifyContent='space-between'>
              <Picker
                style={{
                  width: 150,
                }}
                itemStyle={{
                  height: 50,
                  color: "white",
                  paddingVertical: 50,
                  fontSize: 18,
                }}
                selectedValue={period}
                onValueChange={(itemValue, itemIndex) =>
                  setPeriod(itemValue)
                }
              >
                {Object.entries(PERIOD_TO_ID).map(([period, id]) => (
                  <Picker.Item
                    key={id}
                    label={period}
                    value={id}
                  />
                ))}
              </Picker>
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
            <StationTabs stations={data.stations} />
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
        {Object.entries(groupBy(station.dishes, dish => dish.category as keyof Dish)).map(([category, dishes]) => (
          <Category key={category} category={category} dishes={dishes} />
        ))}
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
    <H3 fontWeight={'bold'}>{category}</H3>
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
        pathname: "/item/[id]",
        params: { id: dish.id },
      }}
    >
      <ListItem pressTheme>
        <XStack>
          <XStack gap="$25">
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
