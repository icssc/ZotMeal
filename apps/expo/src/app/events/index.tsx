import { useEffect} from "react";
import { Link } from "expo-router";
import { format } from "date-fns";
import { H3, Image, ScrollView, Text, YStack } from "tamagui";

import type { Event } from "@zotmeal/db";
import { useEvents } from "./eventsContext";

import { RestaurantTabs } from "~/components";

import { api } from "~/utils/api";


// Create a context for events, default value is a test event
const testData: Event = {
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

// Events Component
export default function Events() {
  const { events, setEvents } = useEvents();

  const eventsQuery = api.event.get.useQuery({});

  useEffect(() => {
    if (eventsQuery?.data) {
      setEvents(eventsQuery.data);
    }
  }, [eventsQuery?.data]);

  if (eventsQuery?.isLoading) {
    return <Text>Loading...</Text>;
  }

  if (eventsQuery?.isError) {
    return <Text>Error: {eventsQuery.error.message}</Text>;
  }
  return (
    <RestaurantTabs>
      <ScrollView
        contentInset={{
          top: 50,
          bottom: 200,
        }}
      >
        {events.map((event: Event, index: number) => (
          <Link
            key={index}
            href={{
              pathname: "/events/event/[id]",
              params: { id: index },
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
        ))}
      </ScrollView>
    </RestaurantTabs>
  );
}
