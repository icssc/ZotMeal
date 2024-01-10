import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRestaurantStore } from "../stores/restaurant";
import { data } from '../lib/data';
import { useThemeStore } from "../stores/theme";
import { Menu } from "./Menu";

export default function Home() {
  const restaurant = useRestaurantStore(store => store.restaurant)
  const textColor = useThemeStore(store => store.textColor)

  const currentData = useMemo(() => {
    return data[restaurant]
  }, [restaurant])

  return (
    <ScrollView>
      <View className="w-full h-full max-w-2xl mx-auto">
        {currentData.all.map((category) => {
          return (
            <View key={category.station} className="p-2 rounded">
              <View className="flex-row items-center justify-between gap-4">
                <Text className={`text-2xl font-semibold ${textColor} shrink`}>
                  {category.station}
                </Text>

                <Pressable className="px-4 py-2 bg-yellow-400 rounded-xl shrink-0">
                  <Text className="">View All</Text>
                </Pressable>
              </View>

              <ScrollView horizontal className="my-2">
                {category.menu.map((menu, index) => {
                  return (
                    <Menu menu={menu} key={menu.category} index={index} textColor={textColor} />
                  )
                })}
              </ScrollView>
            </View>
          )
        })}
      </View>
    </ScrollView>
  );
}
