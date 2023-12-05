import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useRestaurantStore } from "../stores/restaurant";
import { data } from '../lib/data'
import { useThemeStore } from "../stores/theme";

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
            <View key={category.station} className="rounded p-2">
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
                    <View key={menu.category}>
                      <View className={`rounded-xl overflow-hidden ${index > 0 && 'ml-3'} border border-white`}>
                        <Text className={`text-xl font-semibold ${textColor} bg-blue-500 p-2`}>
                          {menu.category} ({menu.items.length})
                        </Text>

                        {/* TODO: create separate components for menu items. Then add an `expand` button */}
                        <View className="flex gap-2 p-2 max-h-[250px]">
                          <View className="flex-row justify-between">
                            <Text className={`${textColor} text-lg font-semibold`}>Dish</Text>
                            <Text className={`${textColor} text-lg font-semibold ml-3`}>Calories</Text>
                          </View>

                          <View className="w-full h-0 border border-white"></View>

                          {menu.items.map((item) => {
                            return (
                              <View key={item.name} className="flex-row justify-between">
                                <Text className={`${textColor}`}>{item.name}</Text>
                                <Text className={`${textColor} ml-3`}>{item.nutrition.calories}</Text>
                              </View>
                            )
                          })}
                        </View>
                      </View>

                      <View className="hidden text-white">
                        <Text>This takes up the remaining flex height.</Text>
                      </View>
                    </View>
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
