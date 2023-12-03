import { Text, View } from "react-native";
import { useRestaurantStore } from "../stores/restaurant";
import { data } from '../lib/data'
import { useMemo } from "react";

export default function Home() {
  const restaurant = useRestaurantStore(store => store.restaurant)

  const currentData = useMemo(() => {
    return data[restaurant]
  }, [restaurant])

  return (
    <View className="h-full w-full max-w-2xl mx-auto p-4">
      <View className="h-full w-full p-4 border-4 rounded-xl">
        <Text className="text-2xl md:text-4xl text-center font-semibold text-red-400">{restaurant}</Text>
        <Text className="text-white">{JSON.stringify(currentData, undefined, 2)}</Text>
      </View>
    </View>
  );
}
