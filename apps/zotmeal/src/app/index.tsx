import { Text, View } from "react-native";

export default function Home() {
  return (
    <View className="h-full w-full max-w-2xl mx-auto p-4">
      <View className="h-full w-full p-4 border-4 rounded-xl">
        <Text className="text-6xl md:text-8xl text-center font-extrabold bg-clip-text  bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400">ZotMeal</Text>
      </View>
    </View>
  );
}
