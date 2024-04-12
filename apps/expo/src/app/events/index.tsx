import { Event } from "@zotmeal/db/src/schema";
import { Link } from "expo-router";
import { H2, H3, Image, ScrollView, Text, YStack } from "tamagui";
import RestaurantTabs from "~/components/RestaurantTabs";
// import { api } from "~/utils/api";

export default function Events() {
  // const { data, error } = api.event.get.useQuery({});

  const testData = Array(5)
    .fill({
      date: new Date(),
      title: "Test Event",
      description: "This is a test event",
      image: "https://via.placeholder.com/150",
      restaurant: "brandywine",
    }) satisfies Event[] as Event[];

  // if (!data) {
  //   return <Text>Loading...</Text>;
  // }

  // if (error) {
  //   return <Text>Error: {error.message}</Text>;
  // }
  return (
    <RestaurantTabs>
      <ScrollView>
        {testData.map((event) => (
          <Link
            key={event.title}
            href={{
              pathname: "/events/event/[id]",
              params: { id: 2 },
            }}
            asChild
          >
            <YStack borderWidth={1} justifyContent="center" alignItems="center" alignContent="center" alignSelf="center">
              <Image source={{ uri: event.image }} width={150} height={150} />
              <H3>{event.title}</H3>
              <Text>{event.description}</Text>
              <Text color="lightgray">{event.date.toDateString()}</Text>
            </YStack>
          </Link>
        ))}
      </ScrollView>
    </RestaurantTabs>
  );
}
