import React from "react";
import { Platform, RefreshControl } from "react-native";
import { AlertTriangle } from "@tamagui/lucide-icons";
import { addDays, isWithinInterval } from "date-fns";
import { toZonedTime } from "date-fns-tz";
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

import { RestaurantTabs } from "~/components/navigation";
import { EventToast } from "~/components/ui/EventToast";
import { PeriodPicker } from "~/components/ui/PeriodPicker";
import { StationTabs } from "~/components/ui/StationTabs";
import { UniversalDatePicker } from "~/components/ui/UniversalDatePicker";
import { useZotmealQuery, useZotmealStore, ZotmealData } from "~/utils";

export default function Home() {
  const theme = useTheme();
  const [date, setDate] = React.useState<Date>(new Date());
  const [brandywinePeriod, setBrandywinePeriod] = React.useState<string | null>(
    null,
  );
  const [anteateryPeriod, setAnteateryPeriod] = React.useState<string | null>(
    null,
  );
  const [restaurant, setRestaurant] =
    React.useState<keyof ZotmealData>("brandywine");
  const { setZotmeal } = useZotmealStore();
  const query = useZotmealQuery(date);
  React.useEffect(() => {
    if (!query.isSuccess) return;

    setZotmeal(query.data);

    // set initial period to the current period or the first period if the current period is not found
    setBrandywinePeriod(
      currentBrandywinePeriod?.name ?? brandywinePeriods[0]?.name ?? null,
    );
    setAnteateryPeriod(
      currentAnteateryPeriod?.name ?? anteateryPeriods[0]?.name ?? null,
    );
  }, [query.data]);

  const anteateryInfo = query.data?.anteatery;
  const brandywineInfo = query.data?.brandywine;

  const anteateryPeriods =
    anteateryInfo?.menus.map((menu) => menu.period) ?? [];
  const brandywinePeriods =
    brandywineInfo?.menus.map((menu) => menu.period) ?? [];

  /**
   * Convert postgres `time` column to PST.
   *
   * e.g. "00:30:00" -> "4:30 PM"
   */
  function utcToPacific(timeString: string) {
    const today = new Date();
    const [hours, minutes, seconds] = timeString.split(":");
    const utcDate = new Date(
      Date.UTC(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        parseInt(hours!),
        parseInt(minutes!),
        parseInt(seconds!),
      ),
    );
    return addDays(toZonedTime(utcDate, "America/Los_Angeles"), 1);
  }

  const currentAnteateryPeriod = anteateryPeriods.find((period) =>
    isWithinInterval(new Date(), {
      start: utcToPacific(period.startTime),
      end: utcToPacific(period.endTime),
    }),
  );

  const currentBrandywinePeriod = brandywinePeriods.find((period) =>
    isWithinInterval(new Date(), {
      start: utcToPacific(period.startTime),
      end: utcToPacific(period.endTime),
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
    (menu) => menu.period.name === brandywinePeriod,
  )?.stations;
  const anteateryStations = anteateryInfo?.menus.find(
    (menu) => menu.period.name === anteateryPeriod,
  )?.stations;

  const NotFound = () => (
    <View alignItems="center" gap="$3">
      <AlertTriangle size="$5" />
      <Text>Menu not found</Text>
    </View>
  );

  // TODO: make it not possible to click into the menu if it's loading
  const MenuContent = () => (
    <>
      <Tabs.Content
        key="brandywine"
        value="brandywine"
        flex={1}
        opacity={query.isLoading ? 0.5 : 1}
      >
        {query.isLoading ? (
          <Spinner
            size="large"
            zIndex={10}
            marginTop="$10"
            position="absolute"
            alignSelf="center"
            marginVertical={200}
          />
        ) : null}
        <XStack
          justifyContent={Platform.OS === "web" ? "unset" : "space-around"}
          columnGap={Platform.OS === "web" ? 20 : 0}
          marginLeft={Platform.OS === "web" ? "$5" : 0}
          marginTop="$3"
        >
          <PeriodPicker
            periods={brandywinePeriods.map((period) => period.name)}
            period={brandywinePeriod}
            setPeriod={setBrandywinePeriod}
            color={theme.color?.val as string}
          />
          <UniversalDatePicker date={date} setDate={setDate} />
        </XStack>
        {brandywineInfo && brandywineStations ? (
          <StationTabs stations={brandywineStations} />
        ) : query.isPending ? null : (
          <NotFound />
        )}
      </Tabs.Content>
      <Tabs.Content
        key="anteatery"
        value="anteatery"
        flex={1}
        opacity={query.isLoading ? 0.5 : 1}
      >
        {query.isLoading ? (
          <Spinner
            size="large"
            zIndex={10}
            marginTop="$10"
            position="absolute"
            alignSelf="center"
            marginVertical={200}
          />
        ) : null}
        <XStack
          justifyContent={Platform.OS === "web" ? "unset" : "space-around"}
          columnGap={Platform.OS === "web" ? 20 : 0}
          marginLeft={Platform.OS === "web" ? "$5" : 0}
          marginTop="$3"
        >
          <PeriodPicker
            periods={anteateryPeriods.map((period) => period.name)}
            period={anteateryPeriod}
            setPeriod={setAnteateryPeriod}
            color={theme.color?.val as string}
          />
          <UniversalDatePicker date={date} setDate={setDate} />
        </XStack>
        {anteateryInfo && anteateryStations ? (
          <StationTabs stations={anteateryStations} />
        ) : query.isPending ? null : (
          <NotFound />
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
