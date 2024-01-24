import { useMemo } from "react";
import { ScrollView, View } from "react-native";
import type { LocationInfo } from '../../../packages/lib/zotmeal';
import Menus from "../components/Menus";
import { data } from '../lib/data';
import { useRestaurantStore } from "../stores/restaurant";

export default function Home() {
  const restaurant = useRestaurantStore(store => store.restaurant);
  const currentData = useMemo(() => {
    return data[restaurant] as LocationInfo;
  }, [restaurant])

  return (
    <ScrollView>
      <View className="w-full h-full max-w-2xl mx-auto">
        {currentData.all.map((station) => {
          return (
            <Menus key={station.station} station={station} />
          )
        })}
      </View>
    </ScrollView>
  );
}
