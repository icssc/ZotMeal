import { useEffect } from "react";
import { Link } from "expo-router";
import { CalendarX2 } from "@tamagui/lucide-icons";
import { format } from "date-fns";
import { H3, Image, Spinner, Tabs, Text, View, YStack } from "tamagui";

import type { Event } from "@zotmeal/db";
import { getRestaurantNameById } from "@zotmeal/utils";

import { RestaurantTabs } from "~/components";
import { useZotmealStore } from "~/utils";
import { api } from "~/utils/api";

// Create a context for events, default value is a test event
const _testData = {
  start: new Date("2022-01-01 12:00:00"),
  end: new Date(),
  title: "Test Event",
  shortDescription: "This is a test event",
  longDescription: `This is a long description of the event. It's so long that it wraps
    around multiple lines. It's a very long description, but it's also
    very interesting. You should definitely read it.`,
  image:
    "https://uci.campusdish.com/-/media/Feature/Articles/DefaultEventImage.ashx?mh=350&mw=350&hash=B788068F09F0E38D1D19756934E293E4C1379BBF",
  restaurantId: "3314",
} satisfies Event;

const EventCard = ({ event }: Readonly<{ event: Event }>) => (
  <Link
    href={{
      pathname: "/events/event/[title]",
      params: { title: event.title },
    }}
    asChild
  >
    <YStack
      borderWidth={1.5}
      borderRadius="$8"
      borderColor="$borderColor"
      width="90%"
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
          resizeMode="contain"
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
  const {
    anteateryEvents,
    brandywineEvents,
    setAnteateryEvents,
    setBrandywineEvents,
  } = useZotmealStore();

  const eventsQuery = api.event.get.useQuery({});

  useEffect(() => {
    if (!eventsQuery?.data) return;

    const anteateryEvents = eventsQuery.data.filter(
      (event: Event) => event.restaurantId === "3056",
    );
    const brandywineEvents = eventsQuery.data.filter(
      (event: Event) => event.restaurantId === "3314",
    );

    setAnteateryEvents(anteateryEvents);
    setBrandywineEvents(brandywineEvents);
  }, [eventsQuery.data, setAnteateryEvents, setBrandywineEvents]);

  // TODO: show a toast if there is an error
  if (eventsQuery?.isError) console.error(eventsQuery.error);

  const EventsContent = () =>
    eventsQuery.isLoading ? (
      <Spinner size="large" marginTop="$10" />
    ) : brandywineEvents && anteateryEvents ? (
      <>
        {[brandywineEvents, anteateryEvents].map((events, index) => (
          <Tabs.Content
            key={index}
            value={getRestaurantNameById(index === 0 ? "3314" : "3056")}
          >
            <YStack>
              {events.map((event, index) => (
                <EventCard key={index} event={event} />
              ))}
            </YStack>
          </Tabs.Content>
        ))}
      </>
    ) : (
      <View alignItems="center">
        <CalendarX2 size="$10" />
        <Text>Events not found</Text>
      </View>
    );

  return (
    <RestaurantTabs>
      <EventsContent />
    </RestaurantTabs>
  );
}
