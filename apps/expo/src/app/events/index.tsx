import React from "react";
import { Link } from "expo-router";
import { CalendarX2 } from "@tamagui/lucide-icons";
import { format, isWithinInterval } from "date-fns";
import { H3, Image, Tabs, Text, View, YStack } from "tamagui";

import type { Event } from "~/utils";
import { RestaurantTabs } from "~/components";
import { useZotmealStore } from "~/utils";

const EventCard = ({ event }: Readonly<{ event: Event }>) => (
  <Link
    href={{
      pathname: "/events/event/[title]",
      params: {
        title: event.title,
        restaurant: event.restaurantId === "3314" ? "brandywine" : "anteatery",
      },
    }}
    asChild
  >
    <YStack
      borderWidth={1.5}
      borderRadius="$8"
      borderColor="$borderColor"
      width="90%"
      maxWidth={500}
      padding="$4"
      marginVertical="$4"
      justifyContent="center"
      alignItems="center"
      alignContent="center"
      alignSelf="center"
      elevation={10}
    >
      <YStack
        justifyContent="center"
        width="100%"
        backgroundColor="$borderColor"
        borderRadius="$6"
      >
        <Image
          objectFit="contain"
          source={{
            uri: event.image ?? "https://via.placeholder.com/150",
          }}
          minWidth={100}
          maxWidth="100%"
          height={175}
        />
      </YStack>
      <H3>{event.title}</H3>
      <Text color="gray">
        {format(event.start.toString(), "LLL do p")} -{" "}
        {format(event.end.toString(), "LLL do p")}
      </Text>
    </YStack>
  </Link>
);

// Events Component
export default function Events() {
  const { zotmeal } = useZotmealStore();
  const [restaurant, setRestaurant] = React.useState<
    "brandywine" | "anteatery"
  >("brandywine");

  const anteateryInfo = zotmeal?.anteatery;
  const brandywineInfo = zotmeal?.brandywine;

  const anteateryEvents = anteateryInfo?.events;
  const brandywineEvents = brandywineInfo?.events;

  const periods = {
    anteatery: anteateryInfo?.menus.map((menu) => menu.period) ?? [],
    brandywine: brandywineInfo?.menus.map((menu) => menu.period) ?? [],
  };

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

  // TODO: show a toast if there is an error

  const EventsContent = () => {
    // if (query.isLoading) return <Spinner size="large" marginTop="$10" />;

    return (
      <>
        <Tabs.Content value="brandywine">
          {brandywineEvents && brandywineEvents.length > 0 ? (
            <YStack>
              {brandywineEvents.map((event, index) => (
                <EventCard key={index} event={event} />
              ))}
            </YStack>
          ) : (
            <View alignItems="center">
              <CalendarX2 size="$10" />
              <Text>No events found</Text>
            </View>
          )}
        </Tabs.Content>
        <Tabs.Content value="anteatery">
          {anteateryEvents && anteateryEvents.length > 0 ? (
            <YStack>
              {anteateryEvents.map((event, index) => (
                <EventCard key={index} event={event} />
              ))}
            </YStack>
          ) : (
            <View alignItems="center">
              <CalendarX2 size="$10" />
              <Text>No events found</Text>
            </View>
          )}
        </Tabs.Content>
      </>
    );
  };

  return (
    <RestaurantTabs
      restaurant={restaurant}
      setRestaurant={setRestaurant}
      anteateryStatus={currentAnteateryPeriod ? "open" : "closed"}
      brandywineStatus={currentBrandywinePeriod ? "open" : "closed"}
    >
      <EventsContent />
    </RestaurantTabs>
  );
}
