import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";
// import { api } from '~/utils/api';
import { useState } from "react";
import { useColorScheme } from "react-native";
import { G, Path, Svg, Text as TextSVG } from "react-native-svg";
import { Link } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import {
  ArrowRight,
  CalendarDays,
  Pin,
  PinOff,
  StarFull,
} from "@tamagui/lucide-icons";
import { Toast, useToastController, useToastState } from "@tamagui/toast";
import {
  Button,
  H3,
  Image,
  ListItem,
  ScrollView,
  Separator,
  Tabs,
  Text,
  useTheme,
  useWindowDimensions,
  View,
  XStack,
  YGroup,
  YStack,
} from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";
import { create } from "zustand";

import type { MenuWithRelations } from "@zotmeal/db/src/schema";
import {
  getCurrentPeriodName,
  getRestaurantNameById,
  isCurrentlyClosed,
  PERIOD_TO_ID,
} from "@zotmeal/utils";

import RestaurantTabs from "~/components/RestaurantTabs";
import groupBy from "~/utils/groupBy";
import { anteateryData, brandywineData } from "./example_data";

type Station = MenuWithRelations["stations"][0];
type Dish = MenuWithRelations["stations"][0]["dishes"][0];
export type RestaurantName = NonNullable<
  ReturnType<typeof getRestaurantNameById>
>;
type PeriodName = NonNullable<ReturnType<typeof getCurrentPeriodName>>;

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
  setSelectedRestaurant: (selectedRestaurant: RestaurantName) =>
    set({ selectedRestaurant }),
  setAnteateryMenu: (anteateryMenu: MenuWithRelations) =>
    set({ anteateryMenu }),
  setBrandywineMenu: (brandywineMenu: MenuWithRelations) =>
    set({ brandywineMenu }),
}));

export function EventToast() {
  const currentToast = useToastState();
  if (!currentToast || currentToast.isHandledNatively) return null;
  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      enterStyle={{ opacity: 0, scale: 1, y: 50 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      // y={0}
      opacity={1}
      scale={1}
      animation="quicker"
      viewportName={currentToast.viewportName}
      borderRadius="$4"
      flexDirection="row"
      width="90%"
      height="$6"
      alignItems="center"
      justifyContent="space-between"
      gap
    >
      <CalendarDays />
      <Toast.Title fontWeight="800">{currentToast.title}</Toast.Title>
      <LinearGradient
        colors={["cornflowerblue", "blueviolet"]}
        borderRadius="$20"
      >
        <Toast.Action altText="See Events" asChild>
          <Link href="/events/" asChild>
            <Button
              backgroundColor={0}
              pressTheme
              size="$4"
              circular
              color="white"
              icon={ArrowRight}
              scaleIcon={1.5}
            />
          </Link>
        </Toast.Action>
      </LinearGradient>
    </Toast>
  );
}

export function Home() {
  const {
    anteateryMenu,
    brandywineMenu,
    // setAnteateryMenu,
    // setBrandywineMenu,
  } = useMenuStore();

  const toast = useToastController();

  const [date, setDate] = useState(new Date());
  const [periodName, setPeriodName] = useState(getCurrentPeriodName());
  const theme = useTheme();

  // const anteateryMenu = anteateryData;
  // const brandywineMenu = brandywineData;

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

  // TODO: Could be better, maybe loading spinner

  // if (anteateryMenu.isLoading || brandywineMenu.isLoading) {
  //   return <View>Loading...</View>;
  // }

  // if (anteateryMenu.isError || brandywineMenu.isError || !anteateryMenu.data || !brandywineMenu.data) {
  //   return <View>Error: {anteateryMenu.error ?? brandywineMenu.error}</View>;
  // }

  if (!anteateryMenu || !brandywineMenu) {
    return <View>Loading...</View>;
  }

  toast.show("There are 5 upcoming events.", {
    // message: 'See upcoming events',
    duration: 10_000_000,
    burntOptions: {
      shouldDismissByDrag: true,
      from: "bottom",
    },
  });

  return (
    <RestaurantTabs>
      <EventToast />
      <XStack justifyContent="space-around">
        <PeriodPicker
          periodName={periodName}
          setPeriodName={setPeriodName}
          color={theme.color?.val as string}
        />
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

      {[brandywineMenu, anteateryMenu].map((menu) => (
        <Tabs.Content
          key={menu.restaurantId}
          value={getRestaurantNameById(menu.restaurantId)!}
          alignItems="center"
          flex={1}
        >
          <StationTabs stations={menu.stations} />
        </Tabs.Content>
      ))}
    </RestaurantTabs>
  );
}

interface PeriodPickerProps {
  periodName: PeriodName;
  setPeriodName: (periodName: PeriodName) => void;
  color: string;
}

const PeriodPicker = ({
  periodName,
  setPeriodName,
  color,
}: PeriodPickerProps) => (
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
    onValueChange={(itemValue, _) => setPeriodName(itemValue)}
  >
    {/* Create a Picker.Item for each period */}
    {Object.entries(PERIOD_TO_ID).map(([period, id]) => (
      <Picker.Item key={id} label={period} value={id} />
    ))}
  </Picker>
);

// Uses the svg from Figma
export const TabSvg = ({ label }: { label: string }) => {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const deviceWidth = useWindowDimensions().width;

  return (
    <Svg
      width={deviceWidth / 2 + 135}
      height="75"
      viewBox="0 0 403 82"
      fill="none"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M-31 82H403C370.624 82 359.956 61.6562 349.248 41.2347C338.458 20.6568 327.626 0 294.5 0H77.5C44.374 0 33.5423 20.6568 22.7519 41.2347C12.0436 61.6562 1.37595 82 -31 82Z"
        fill={colorScheme === "dark" ? "#1A1B1D" : "#FFFFFF"}
      />
      <G>
        <TextSVG
          x="50%"
          y="30%"
          fill={theme.color?.val as string}
          textAnchor="middle"
          alignmentBaseline="central"
          fontSize="25"
          fontWeight="bold"
        >
          {label}
        </TextSVG>
        <TextSVG
          x="50%"
          y="60%"
          fill={isCurrentlyClosed() ? "firebrick" : "forestgreen"}
          textAnchor="middle"
          alignmentBaseline="central"
          fontSize="18"
          fontWeight="bold"
        >
          {isCurrentlyClosed() ? "CLOSED" : "OPEN"}
        </TextSVG>
      </G>
    </Svg>
  );
};

const StationTabs = ({ stations }: { stations: Station[] }) => (
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
        bounces={false} // Disable bounce for the station tabs
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
      <Tabs.Content key={station.name} value={station.name}>
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
          {Object.entries(
            groupBy(station.dishes, (dish) => dish.category as keyof Dish),
          ).map(([category, dishes]) => (
            <Category key={category} category={category} dishes={dishes} />
          ))}
        </ScrollView>
      </Tabs.Content>
    ))}
  </Tabs>
);

const Category = ({
  category,
  dishes,
}: {
  category: string;
  dishes: Dish[];
}) => (
  <YStack key={category} width={"100%"}>
    <H3 fontWeight={"800"} marginTop="$5" paddingLeft="$2">
      {category}
    </H3>
    <YGroup bordered separator={<Separator borderWidth={1} />}>
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} />
      ))}
    </YGroup>
  </YStack>
);

const DishCard = ({ dish }: { dish: Dish }) => (
  <YGroup.Item>
    <Link
      asChild
      href={{
        pathname: "/home/item/[id]",
        params: { id: dish.id },
      }}
    >
      <ListItem pressTheme>
        <XStack justifyContent="space-between" paddingRight="$4">
          <Image
            resizeMode="contain"
            alignSelf="center"
            width={65}
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
              {dummyUserPins.includes(dish.id) ? (
                <Button minWidth={"48%"} scale={0.8} fontWeight={"800"}>
                  Unpin <PinOff />
                </Button>
              ) : (
                <Button minWidth={"48%"} scale={0.8} fontWeight={"800"}>
                  Pin <Pin />
                </Button>
              )}
            </XStack>
          </YStack>
        </XStack>
      </ListItem>
    </Link>
  </YGroup.Item>
);
