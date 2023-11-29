import { View, Text } from "react-native";
import { greeting } from 'ui/greeting'

export function Home() {
  return (
    <View className="p-8 h-full w-full">
      <View className="w-full max-w-2xl h-full mx-auto">
        <Text className="text-2xl font-bold">ZotMeal {greeting}</Text>
      </View>
    </View>
  );
}
