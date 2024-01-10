import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import type { MenuInfo, ItemInfo } from '../../../../packages/shared/lib/zotmeal.types';
import { useState } from "react";
import { useThemeStore } from "../stores/theme";

function Item({ item }: {
  item: ItemInfo;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const textColor = useThemeStore(store => store.textColor);
  const bgColor = useThemeStore(store => store.bgColor);

  return (
    <Pressable onPress={() => setShowDetails(!showDetails)}>
      <View key={item.name} className="flex-row justify-between">
        <Text className={textColor}>{item.name}</Text>
        <Text className={`${textColor} ml-3`}>{item.nutrition.calories}</Text>
      </View>
      <Modal
        animationType="fade"
        transparent
        visible={showDetails}
        onRequestClose={() => setShowDetails(false)}
      >
        <View
          id='bruh'
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          className='items-center justify-center flex-1 w-full h-full'
        >
          <View className={`${bgColor} border border-white w-5/6 h-4/6 lg:w-1/2 lg:h-1/2 inset-x-0 top-10`}>
            <Pressable
              onPress={() => setShowDetails(false)}
              className={`${textColor} absolute z-10 top-0 right-0`}
            >
              <Text className={`${textColor} text-lg`}>Back</Text>
            </Pressable>
            <Text className={`${textColor} text-lg`}>Description</Text>
            <Text className={`${textColor} text-lg`}>{item.description}</Text>
            <ScrollView >
              {Object.entries(item.nutrition).map(([key, value], index) => {
                return (
                  <View key={index} className="flex-row justify-between">
                    <Text className={`${textColor} text-lg`}>{key}: {value}</Text>
                  </View>
                )
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Pressable>
  );
}

export function Menu({ menu, index, textColor }: {
  menu: MenuInfo,
  index: number,
  textColor: string,
}) {
  return (
    <View key={menu.category}>
      <View className={`rounded-xl overflow-hidden ${index > 0 && 'ml-3'} border border-white`}>
        <Text className={`text-xl font-semibold ${textColor} bg-blue-500 p-2`}>
          {menu.category} ({menu.items.length})
        </Text>

        <View className="flex gap-2 p-2 max-h-[250px]">
          <View className="flex-row justify-between">
            <Text className={`${textColor} text-lg font-semibold`}>Dish</Text>
            <Text className={`${textColor} text-lg font-semibold ml-3`}>Calories</Text>
          </View>

          <View className="w-full h-0 border border-white" />

          {menu.items.map((item) => {
            return (
              <Item key={item.name} item={item} />
            );
          })}
        </View>
      </View>

      <View className="hidden text-white">
        <Text>This takes up the remaining flex height.</Text>
      </View>
    </View>
  );
}