import { Pressable, Text, View } from "react-native";
import type { MenuInfo } from '../../../../packages/shared/lib/zotmeal.types';

// TODO: Add an expand
export function Item({ menu, textColor }: {
  menu: MenuInfo,
  textColor: string,
}) {
  return <View className="flex gap-2 p-2 max-h-[250px]">
    <View className="flex-row justify-between">
      <Text className={`${textColor} text-lg font-semibold`}>Dish</Text>
      <Text className={`${textColor} text-lg font-semibold ml-3`}>Calories</Text>
    </View>

    <View className="w-full h-0 border border-white" />

    {menu.items.map((item) => {
      return (
        <View key={item.name} className="flex-row justify-between">
          <Text className={textColor}>{item.name}</Text>
          <Text className={`${textColor} ml-3`}>{item.nutrition.calories}</Text>
        </View>
      );
    })}
  </View>;
}
