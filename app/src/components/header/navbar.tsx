import { Pressable, Text, View } from "react-native";
import { useThemeStore } from "../../stores/theme";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export function Navbar() {
  const bg = useThemeStore((store) => store.bgColor);
  const textColor = useThemeStore((store) => store.textColor);

  return (
    <View className={`p-2 ${bg} h-12 flex-row justify-between items-center`}>
      <Pressable className="flex-row items-center gap-2">
        <Ionicons name="refresh-circle" size={24} color="#1284FD" />
        <Text className={`${textColor}`}>Refresh</Text>
      </Pressable>

      <Text className={`${textColor} text-2xl text-center font-extrabold`}>
        ZotMeal
      </Text>

      <View className="flex-row items-center gap-2">
        <Pressable>
          <MaterialCommunityIcons name="heart-circle" size={24} color="#FE375F" />
        </Pressable>
        <Pressable>
          <Ionicons name="ellipsis-horizontal-circle-sharp" size={24} color="#1284FD" />
        </Pressable>
      </View>
    </View>
  );
}
