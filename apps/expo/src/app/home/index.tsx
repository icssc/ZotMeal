import { useEffect, useState } from "react";
import { Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CalendarDays } from "@tamagui/lucide-icons";
import { useToastController } from "@tamagui/toast";
import { endOfWeek, startOfWeek } from "date-fns";
import { Button, Tabs, Text, useTheme, XStack } from "tamagui";

import type { PeriodName } from "@zotmeal/utils";
import {
  getCurrentPeriodName,
  getRestaurantNameById,
  restaurantNames,
} from "@zotmeal/utils";

import { useMenuStore } from "~/utils";
import { api } from "~/utils/api";
import { EventToast } from "./_components/event-toast";
import { PeriodPicker } from "./_components/period-picker";
import { StationTabs } from "./_components/station-tabs";
import RestaurantTabs from '~/components/navigation/RestaurantTabs';

export function Home() {
  const { anteateryMenu, brandywineMenu, setAnteateryMenu, setBrandywineMenu } =
    useMenuStore();

  const toast = useToastController();

  const [showDatePicker, setShowDatePicker] = useState<boolean>(true);
  const [date, setDate] = useState<Date>(new Date());

  const currentPeriod = getCurrentPeriodName();

  // TODO: how should we handle fetching when restaurant is closed?
  const [periodName, setPeriodName] = useState<PeriodName>(
    currentPeriod === "closed" ? "breakfast" : currentPeriod,
  );
  const theme = useTheme();

  // TODO: how should we handle fetching when restaurant is closed?
  const [anteateryQuery, brandywineQuery] = api.useQueries((t) =>
    restaurantNames.map((restaurantName) =>
      t.menu.get({
        date: date.toLocaleDateString("en-US"),
        period: periodName,
        restaurant: restaurantName,
      }),
    ),
  );
  console.log(anteateryQuery);
  console.log(brandywineQuery);

  useEffect(() => {
    if (anteateryQuery?.data) {
      setAnteateryMenu(anteateryQuery.data);
    }

    if (brandywineQuery?.data) {
      setBrandywineMenu(brandywineQuery.data);
    }

    if (
      anteateryQuery &&
      brandywineQuery &&
      anteateryQuery.isSuccess &&
      brandywineQuery.isSuccess
    ) {
      toast.show("There are 5 upcoming events.", {
        // message: 'See upcoming events',
        duration: 10_000_000,
        burntOptions: {
          shouldDismissByDrag: true,
          from: "bottom",
        },
      });
    }
  }, [
    anteateryQuery?.data,
    brandywineQuery?.data,
    setAnteateryMenu,
    setBrandywineMenu,
    toast,
  ]);

  if (!anteateryQuery || !brandywineQuery) {
    return <Text>Fetching menus</Text>;
  }

  // TODO: maybe loading spinner instead
  if (anteateryQuery.isLoading || brandywineQuery.isLoading) {
    return <Text>Loading...</Text>;
  }

  if (anteateryQuery.isError || brandywineQuery.isError) {
    console.error(anteateryQuery.error, brandywineQuery.error);
    return (
      <>
        <Text>{anteateryQuery.error?.message}</Text>
        <Text>{brandywineQuery.error?.message}</Text>
      </>
    );
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
