import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { AlertTriangle } from "@tamagui/lucide-icons";
import { useToastController } from "@tamagui/toast";
import {
  ScrollView,
  Spinner,
  Tabs,
  Text,
  useTheme,
  View,
  XStack,
} from "tamagui";

import type { PeriodName } from "@zotmeal/utils";
import {
  getCurrentPeriodName,
  getDayPeriodsByDate,
  getRestaurantNameById,
  restaurantNames,
} from "@zotmeal/utils";

import { RestaurantTabs } from "~/components";
import { api } from "~/utils/api";
import useZotmealStore from "~/utils/useZotmealStore";
import { UniversalDatePicker } from "./_components/date-picker";
import { EventToast } from "./_components/event-toast";
import { PeriodPicker } from "./_components/period-picker";
import { StationTabs } from "./_components/station-tabs";

export function Home() {
  const { anteateryMenu, brandywineMenu, setAnteateryMenu, setBrandywineMenu } =
    useZotmealStore();

  const toast = useToastController();

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
      t.menu.get(
        {
          date: date.toLocaleDateString("en-US"),
          period: periodName,
          restaurant: restaurantName,
        },
        {
          refetchOnWindowFocus: false,
        },
      ),
    ),
  );

  useEffect(() => {
    if (anteateryQuery?.data) setAnteateryMenu(anteateryQuery.data);
    if (brandywineQuery?.data) setBrandywineMenu(brandywineQuery.data);

    if (anteateryQuery?.isError) setAnteateryMenu(null);
    if (brandywineQuery?.isError) setBrandywineMenu(null);

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

  if (!anteateryQuery || !brandywineQuery)
    throw new Error("Unreachable: anteateryQuery and brandywineQuery are null");

  // TODO: show a toast if there is an error
  if (anteateryQuery.isError || brandywineQuery.isError) {
    if (anteateryQuery.error) console.error(anteateryQuery.error);
    if (brandywineQuery.error) console.error(brandywineQuery.error);
  }

  const MenuContent = () =>
    anteateryQuery.isLoading || brandywineQuery.isLoading ? (
      <Spinner size="large" marginTop="$10" />
    ) : brandywineMenu && anteateryMenu ? (
      <>
        {[brandywineMenu, anteateryMenu].map((menu) => (
          <Tabs.Content
            key={menu.restaurantId}
            value={getRestaurantNameById(menu.restaurantId)}
            alignItems="center"
            flex={1}
          >
            <StationTabs stations={menu.stations} />
          </Tabs.Content>
        ))}
      </>
    ) : (
      <View alignItems="center">
        <AlertTriangle size="$10" />
        <Text>Menu not found</Text>
      </View>
    );

  return (
    <RestaurantTabs>
      <ScrollView>
        <EventToast />

        <XStack
          justifyContent={Platform.OS === "web" ? "center" : "space-around"}
          columnGap={Platform.OS === "web" ? 20 : 0}
        >
          <PeriodPicker
            availablePeriods={getDayPeriodsByDate(date)}
            periodName={periodName}
            setPeriodName={setPeriodName}
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
