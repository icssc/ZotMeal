import { Text } from "tamagui";
import { api } from "~/utils/api";

export default function Events() {
  const { data, error } = api.event.get.useQuery({});

  if (!data) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }
  return (
    <Text>Events</Text>
  );
}
