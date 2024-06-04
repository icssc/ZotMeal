import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { AlertTriangle, RefreshCw } from "@tamagui/lucide-icons";
import { useToastController } from "@tamagui/toast";
import {
  Button,
  ScrollView,
  Spinner,
  Tabs,
  Text,
  useDebounce,
  useTheme,
  View,
  XStack,
} from "tamagui";

import type { PeriodName } from "@zotmeal/utils";
import { getCurrentPeriodName, getDayPeriodsByDate } from "@zotmeal/utils";

import { RestaurantTabs } from "~/components";
import { useZotmealStore } from "~/utils";
import { api } from "~/utils/api";
import { UniversalDatePicker } from "../../app/home/_components/date-picker";
import { EventToast } from "../../app/home/_components/event-toast";
import { PeriodPicker } from "../../app/home/_components/period-picker";
import { StationTabs } from "../../app/home/_components/station-tabs";

export function Home() {
  const { anteateryMenu, brandywineMenu, setAnteateryMenu, setBrandywineMenu } =
    useZotmealStore();

  const toast = useToastController();

  const [date, setDate] = useState<Date>(new Date());

  const currentPeriod = getCurrentPeriodName();

  const [period, setPeriod] = useState<PeriodName>(
    currentPeriod === "closed" ? "breakfast" : currentPeriod,
  );

  const theme = useTheme();

  const queryOptions = {
    retry: false,
    refetchOnWindowFocus: false,
  } satisfies Parameters<typeof api.menu.get.useQuery>[1];

  const anteateryQuery = api.menu.get.useQuery(
    {
      date: date.toLocaleDateString("en-US"),
      period,
      restaurant: "anteatery",
    },
    queryOptions,
  );

  const brandywineQuery = api.menu.get.useQuery(
    {
      date: date.toLocaleDateString("en-US"),
      period,
      restaurant: "brandywine",
    },
    queryOptions,
  );

  // ! Not sure if this is actually working but we do want debouncing for the refresh button
  const refetchMenusWithDebounce = useDebounce(
    () => {
      anteateryQuery.refetch();
      brandywineQuery.refetch();
    },
    1000,
    { leading: true },
  );

  useEffect(() => {
    if (anteateryQuery.isSuccess) setAnteateryMenu(anteateryQuery.data);
    if (brandywineQuery.isSuccess) setBrandywineMenu(brandywineQuery.data);

    if (anteateryQuery.isSuccess && brandywineQuery.isSuccess) {
      toast.show("There are 5 upcoming events.", {
        // message: 'See upcoming events',
        duration: 10_000_000,
        burntOptions: {
          shouldDismissByDrag: true,
          from: "bottom",
        },
      });
    }
  }, [anteateryQuery.data, brandywineQuery.data, toast]);

  // TODO: show a toast if there is an error
  if (
    (anteateryMenu && anteateryQuery.isError) ||
    (brandywineMenu && brandywineQuery.isError)
  ) {
    if (anteateryQuery.error)
      console.error("anteatery query error", anteateryQuery.error);
    if (brandywineQuery.error)
      console.error("brandywine query error", brandywineQuery.error);

    setAnteateryMenu(null);
    setBrandywineMenu(null);
  }

  // TODO: make it not possible to click into the menu if it's loading
  const MenuContent = () => (
    <>
      <Tabs.Content
        key="brandywine"
        value="brandywine"
        alignItems="center"
        flex={1}
        opacity={brandywineQuery.isLoading ? 0.5 : 1}
      >
        {brandywineQuery.isLoading ? (
          <Spinner
            size="large"
            zIndex={10}
            marginTop="$10"
            position="absolute"
            marginVertical={200}
          />
        ) : null}
        {brandywineMenu ? (
          <StationTabs stations={brandywineMenu.stations} />
        ) : brandywineQuery.isPending ? null : (
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
        opacity={anteateryQuery.isLoading ? 0.5 : 1}
      >
        {anteateryQuery.isLoading ? (
          <Spinner
            size="large"
            zIndex={10}
            marginTop="$10"
            position="absolute"
            marginVertical={200}
          />
        ) : null}
        {anteateryMenu ? (
          <StationTabs stations={anteateryMenu.stations} />
        ) : anteateryQuery.isPending ? null : (
          <View alignItems="center">
            <AlertTriangle size="$10" />
            <Text>Menu not found</Text>
          </View>
        )}
      </Tabs.Content>
    </>
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
            period={period}
            setPeriod={(period) => {
              setPeriod(period);
              refetchMenusWithDebounce();
            }}
            color={theme.color?.val as string}
          />
          <UniversalDatePicker
            date={date}
            setDate={(date) => {
              setDate(date);
              refetchMenusWithDebounce();
            }}
          />
          <Button
            disabled={anteateryQuery.isLoading || brandywineQuery.isLoading}
            opacity={
              anteateryQuery.isLoading || brandywineQuery.isLoading ? 0.5 : 1
            }
            onPress={refetchMenusWithDebounce}
            icon={<RefreshCw />}
          />
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
