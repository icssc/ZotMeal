import { Text, View } from "react-native";

export function Header() {
  return (
    <View className="h-36 p-4 border-b-4 border-blue-800 bg-blue-400 flex justify-center">
      <Text className="text-4xl font-bold">Header</Text>
    </View>
  );
}
