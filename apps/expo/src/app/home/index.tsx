import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { Link } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { ArrowRight, CalendarDays, StarFull } from "@tamagui/lucide-icons";
import { Toast, useToastController, useToastState } from "@tamagui/toast";
import { endOfWeek, startOfWeek } from "date-fns";
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
  XStack,
  YGroup,
  YStack,
} from "tamagui";
import { LinearGradient } from "tamagui/linear-gradient";

import type { MenuWithRelations } from "@zotmeal/db";
import type { PeriodName } from "@zotmeal/utils";
import {
  getCurrentPeriodName,
  getRestaurantNameById,
  PeriodEnum,
  restaurantNames,
} from "@zotmeal/utils";

import { PinButton, RestaurantTabs } from "~/components";
import { groupBy, useMenuStore } from "~/utils";
import { api } from "~/utils/api";

type Station = MenuWithRelations["stations"][0];
type Dish = MenuWithRelations["stations"][0]["dishes"][0];

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
    >
      <CalendarDays />
      <Toast.Title fontWeight="800">{currentToast.title}</Toast.Title>
      <LinearGradient
        colors={["cornflowerblue", "blueviolet"]}
        borderRadius="$20"
      >
        <Toast.Action altText="See Events" asChild>
          <Link href="/events/" asChild replace>
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
  // const { anteateryMenu, brandywineMenu, setAnteateryMenu, setBrandywineMenu } =
  //   useMenuStore();

  // const toast = useToastController();

  const [showDatePicker, setShowDatePicker] = useState<boolean>(true);
  const [date, setDate] = useState<Date>(new Date());

  const currentPeriod = getCurrentPeriodName();

  // TODO: how should we handle fetching when restaurant is closed?
  const [periodName, setPeriodName] = useState<PeriodName>(
    currentPeriod === "closed" ? "breakfast" : currentPeriod,
  );
  const theme = useTheme();

  // // TODO: how should we handle fetching when restaurant is closed?
  // const [anteateryQuery, brandywineQuery] = api.useQueries((t) =>
  //   restaurantNames.map((restaurantName) =>
  //     t.menu.get({
  //       date: date.toLocaleDateString("en-US"),
  //       period: periodName,
  //       restaurant: restaurantName,
  //     }),
  //   ),
  // );

  // useEffect(() => {
  //   if (anteateryQuery?.data) {
  //     setAnteateryMenu(anteateryQuery.data);
  //   }

  //   if (brandywineQuery?.data) {
  //     setBrandywineMenu(brandywineQuery.data);
  //   }
  // }, [anteateryQuery, brandywineQuery, setAnteateryMenu, setBrandywineMenu]);

  // if (!anteateryQuery || !brandywineQuery) {
  //   return <Text>Fetching menus</Text>;
  // }

  // // TODO: maybe loading spinner instead
  // if (anteateryQuery.isLoading || brandywineQuery.isLoading) {
  //   return <Text>Loading...</Text>;
  // }

  // if (anteateryQuery.isError || brandywineQuery.isError) {
  //   console.error(anteateryQuery.error, brandywineQuery.error);
  //   return (
  //     <>
  //       <Text>{anteateryQuery.error?.message}</Text>
  //       <Text>{brandywineQuery.error?.message}</Text>
  //     </>
  //   );
  // }

  // toast.show("There are 5 upcoming events.", {
  //   // message: 'See upcoming events',
  //   duration: 10_000_000,
  //   burntOptions: {
  //     shouldDismissByDrag: true,
  //     from: "bottom",
  //   },
  // });

  const hello = api.menu.hello.useQuery();

  // fetch("http://localhost:3000/menu.hello")
  //   .then((res) => res.json())
  //   .then(console.log)
  //   .catch(console.error);

  const { data, error, isLoading } = hello;

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return (
      <Text>
        {error.data?.code}
        {error.message}
      </Text>
    );
  }

  if (!data) {
    return <Text>No data</Text>;
  }

  if (data) {
    return <Text>{data}</Text>;
  }

  return (
    <RestaurantTabs>
      <EventToast />
      <XStack justifyContent="space-around">
        <PeriodPicker
          periodName={periodName}
          setPeriodName={setPeriodName}
          color={theme.color?.val as string}
        />
        {Platform.OS === "android" && (
          <Button
            onPress={() => setShowDatePicker(true)}
            icon={CalendarDays}
            scaleIcon={1.5}
            size="$5"
            borderRadius="$10"
            pressTheme
          >
            {date.toLocaleDateString("en-US")}
          </Button>
        )}
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            minimumDate={startOfWeek(new Date())}
            maximumDate={endOfWeek(new Date())}
            onChange={(_, selectedDate) => {
              // hide date picker on android
              setShowDatePicker(Platform.OS === "ios");
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        )}
      </XStack>

      {[brandywineMenu, anteateryMenu].map((menu) => (
        <>
          {menu && (
            <Tabs.Content
              key={menu.restaurantId}
              value={getRestaurantNameById(menu.restaurantId)}
              alignItems="center"
              flex={1}
            >
              <StationTabs stations={menu.stations} />
            </Tabs.Content>
          )}
        </>
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
}: Readonly<PeriodPickerProps>) => (
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
    {Object.entries(PeriodEnum).map(([period, id]) => (
      <Picker.Item key={id} label={period} value={id} />
    ))}
  </Picker>
);

const StationTabs = ({ stations }: Readonly<{ stations: Station[] }>) => (
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
        bounces={false}
        showsHorizontalScrollIndicator={false}
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
            <Category
              key={category}
              stationId={station.id}
              category={category}
              dishes={dishes}
            />
          ))}
        </ScrollView>
      </Tabs.Content>
    ))}
  </Tabs>
);

const Category = ({
  stationId,
  category,
  dishes,
}: Readonly<{
  stationId: Station["id"];
  category: string;
  dishes: Dish[];
}>) => (
  <YStack key={category} width={"100%"}>
    <H3 fontWeight={"800"} marginTop="$5" paddingLeft="$2">
      {category}
    </H3>
    <YGroup bordered separator={<Separator borderWidth={1} />}>
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} stationId={stationId} />
      ))}
    </YGroup>
  </YStack>
);

const DishCard = ({
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
