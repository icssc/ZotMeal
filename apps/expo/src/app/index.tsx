import React from "react";
import { Platform, RefreshControl } from "react-native";
import { AlertTriangle } from "@tamagui/lucide-icons";
import { isWithinInterval } from "date-fns";
import {
  ScrollView,
  Spinner,
  Tabs,
  Text,
  useDebounce,
  useTheme,
  View,
  XStack,
} from "tamagui";

import { RestaurantTabs } from "~/components";
import { useZotmealQuery, useZotmealStore, ZotmealData } from "~/utils";
import { EventToast } from "../components/ui/EventToast";
import { PeriodPicker } from "../components/ui/PeriodPicker";
import { StationTabs } from "../components/ui/StationTabs";
import { UniversalDatePicker } from "../components/ui/UniversalDatePicker";

export default function Home() {
  const theme = useTheme();
  const [date, setDate] = React.useState<Date>(new Date());
  const [period, setPeriod] = React.useState<string | null>(null);
  const [restaurant, setRestaurant] =
    React.useState<keyof ZotmealData>("brandywine");
  const { setZotmeal } = useZotmealStore();
  const query = useZotmealQuery(date);
  React.useEffect(() => {
    if (!query.isSuccess) return;

    setZotmeal(query.data);

    // set initial period to the current period or the first period if the current period is not found
    setPeriod(currentPeriod?.name ?? periods[restaurant][0]?.name ?? null);
  }, [query.data]);

  const anteateryInfo = query.data?.anteatery;
  const brandywineInfo = query.data?.anteatery;

  const periods = {
    anteatery: anteateryInfo?.menus.map((menu) => menu.period) ?? [],
    brandywine: brandywineInfo?.menus.map((menu) => menu.period) ?? [],
  };

  const currentPeriod = periods[restaurant].find((period) =>
    isWithinInterval(new Date(), {
      start: period.startTime,
      end: period.endTime,
    }),
  );

  const currentAnteateryPeriod = periods.anteatery.find((period) =>
    isWithinInterval(new Date(), {
      start: period.startTime,
      end: period.endTime,
    }),
  );

  const currentBrandywinePeriod = periods.brandywine.find((period) =>
    isWithinInterval(new Date(), {
      start: period.startTime,
      end: period.endTime,
    }),
  );

  // ! Not sure if this is actually working but we do want debouncing for the refresh button
  const refetchWithDebounce = useDebounce(
    async () => await query.refetch(),
    1000,
    {
      leading: true,
    },
  );

  // const toast = useToastController();
  // useEffect(() => {
  //   if (isSuccess) {
  //     toast.show("There are 5 upcoming events.", {
  //       // message: 'See upcoming events',
  //       duration: 10_000_000,
  //       burntOptions: {
  //         shouldDismissByDrag: true,
  //         from: "bottom",
  //       },
  //     });
  //   }
  // }, [data, toast]);
  // TODO: show a toast if there is an error

  // Get the stations for the current period
  const brandywineStations = brandywineInfo?.menus.find(
    (menu) => menu.period.name === period,
  )?.stations;
  const anteateryStations = anteateryInfo?.menus.find(
    (menu) => menu.period.name === period,
  )?.stations;

  // TODO: make it not possible to click into the menu if it's loading
  const MenuContent = () => (
    <>
      <Tabs.Content
        key="brandywine"
        value="brandywine"
        alignItems="center"
        flex={1}
        opacity={query.isLoading ? 0.5 : 1}
      >
        {query.isLoading ? (
          <Spinner
            size="large"
            zIndex={10}
            marginTop="$10"
            position="absolute"
            marginVertical={200}
          />
        ) : null}
        {brandywineInfo && brandywineStations ? (
          <StationTabs stations={brandywineStations} />
        ) : query.isPending ? null : (
          <View alignItems="center">
            <AlertTriangle size="$10" />
            <Text>Menu not found</Text>
          </View>
        )}
      </Tabs.Content>
      <Tabs.Content
        key="anteatery"
        value="anteatery"
        alignItems="center"
        flex={1}
        opacity={query.isLoading ? 0.5 : 1}
      >
        {query.isLoading ? (
          <Spinner
            size="large"
            zIndex={10}
            marginTop="$10"
            position="absolute"
            marginVertical={200}
          />
        ) : null}
        {anteateryInfo && anteateryStations ? (
          <StationTabs stations={anteateryStations} />
        ) : query.isPending ? null : (
          <View alignItems="center">
            <AlertTriangle size="$10" />
            <Text>Menu not found</Text>
          </View>
        )}
      </Tabs.Content>
    </>
  );

  return (
    <RestaurantTabs
      restaurant={restaurant}
      setRestaurant={setRestaurant}
      anteateryStatus={currentAnteateryPeriod ? "open" : "closed"}
      brandywineStatus={currentBrandywinePeriod ? "open" : "closed"}
    >
      <ScrollView
        refreshControl={
          <RefreshControl
            /**
             * ! The indicator is hidden for now since it doesn't seem to show up on state change for the date.
             * If there is a way to show this indicator when the user changes the date, we can use this indicator instead.
             *
             * @see https://github.com/facebook/react-native/issues/24855
             */
            refreshing={false}
            onRefresh={refetchWithDebounce}
          />
        }
      >
        <EventToast />

        <XStack
          justifyContent={Platform.OS === "web" ? "center" : "space-around"}
          columnGap={Platform.OS === "web" ? 20 : 0}
        >
          <PeriodPicker
            periods={periods[restaurant].map((period) => period.name)}
            period={period}
            setPeriod={setPeriod}
            color={theme.color?.val as string}
          />
          <UniversalDatePicker date={date} setDate={setDate} />
        </XStack>
        {/*
        <ScrollView horizontal>
          <XStack gap={10}>
            <CategoryCard
              category="Soups"
              image={""}
              onPress={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
            <CategoryCard
              category="Vegan"
              image={""}
              onPress={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
            <CategoryCard
              category="Noodles"
              image={""}
              onPress={function (): void {
                throw new Error("Function not implemented.");
              }}
            />
          </XStack>
        </ScrollView> */}

        <MenuContent />
      </ScrollView>
    </RestaurantTabs>
  );
}
