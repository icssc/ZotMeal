import { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
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
      <View className="h-full w-full max-w-2xl mx-auto">
        <View className="h-full w-full border-4 rounded-xl">
          <View className="gap-8">
            {currentData.all.map((category) => {
              return (
                <View key={category.station} className="flex gap-4 rounded">
                  <Text className={`text-2xl font-semibold ${textColor}`}>
                    {category.station}
                  </Text>

                  <ScrollView horizontal>
                    {category.menu.map((menu, index) => {
                      return (
                        <View key={menu.category}>
                          <View className={`rounded-xl overflow-hidden ${index > 0 && 'ml-3'} border border-white`}>
                            <Text className={`text-xl font-semibold ${textColor} bg-blue-500 p-2`}>
                              {menu.category} ({menu.items.length})
                            </Text>

                            <View className="flex gap-2 p-2">
                              <View className="flex-row justify-between gap-3">
                                <Text className={`${textColor} text-lg font-semibold`}>Dish</Text>
                                <Text className={`${textColor} text-lg font-semibold`}>Calories</Text>
                              </View>

                              <View className="w-full h-0 border border-white"></View>

                              {menu.items.map((item) => {
                                return (
                                  <View key={item.name} className="flex-row justify-between gap-3">
                                    <Text className={`${textColor}`}>{item.name}</Text>
                                    <Text className={`${textColor}`}>{item.nutrition.calories}</Text>
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
        </View>
      </View>
    </ScrollView>
  );
}
