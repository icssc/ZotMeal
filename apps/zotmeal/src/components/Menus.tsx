import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import type { ItemInfo, MenuInfo, StationInfo } from "../../../../packages/shared/lib/zotmeal.types";
import { useThemeStore } from "../stores/theme";
import { ModalWithClickOut } from "./ModalWithClickOut";

function Item({ item, viewAll }: {
  item: ItemInfo,
  viewAll: boolean,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [expand, setExpand] = useState(false);
  const textColor = useThemeStore(store => store.textColor);
  const bgColor = useThemeStore(store => store.bgColor);

  return (
    <>
      {viewAll
        ? <>
          <View key={item.name} className="flex-row justify-between px-2">
            <Text className={`${textColor} text-xl font-bold`}>{item.name}</Text>
            <Text className={`${textColor} ml-3`}>{item.nutrition.calories}</Text>
          </View>
          <Text className={`${textColor} pl-2 py-2`}>{item.description}</Text>
          <View className={`w-full h-[0.5px] ${bgColor === "bg-black" ? "bg-white" : "bg-black"}`} />
          <Pressable
            onPress={() => setExpand(!expand)}
            className="active:bg-yellow-400"
          >
            <Text className={`${textColor} text-base font-bold pl-2`}>Nutrition Facts</Text>
          </Pressable>
          {expand &&
            Object.entries(item.nutrition).map(([key, value], index) => {
              return (
                <View key={index} className="flex-row justify-between">
                  <Text className={`${textColor}`}>{key}</Text>
                  <Text className={`${textColor}`}>{value}</Text>
                </View>
              )
            })
          }
        </>
        : <>
          <Pressable
            onPress={() => setModalVisible(!modalVisible)}
            className="active:bg-yellow-400"
          >
            <View className="flex-row justify-between px-2">
              <Text className={textColor}>{item.name}</Text>
              <Text className={`${textColor} ml-3`}>{item.nutrition.calories}</Text>
            </View>
          </Pressable>
          <ModalWithClickOut
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          >
            <View className={`${bgColor} border border-white w-5/6 h-4/6 lg:w-1/2 lg:h-4/6 p-2 inset-x-0 top-10`}>
              <Pressable
                onPress={() => setModalVisible(false)}
                className={`${textColor} absolute z-10 top-5 right-10`}
              >
                <Text className={`${textColor} text-lg`}>Back</Text>
              </Pressable>
              <Text className={`${textColor} text-2xl font-bold`}>{item.name}</Text>
              <Text className={`${textColor} text-xl font-bold`}>Description</Text>
              <Text className={`${textColor} text-lg`}>{item.description}</Text>
              <Text className={`${textColor} text-2xl font-bold`}>Nutrition Facts</Text>
              <ScrollView>
                <View className="items-center justify-center">
                  <View className="w-5/6">
                    {Object.entries(item.nutrition).map(([key, value], index) => {
                      return (
                        <View key={index} className="flex-row justify-between">
                          <Text className={`${textColor} text-lg`}>{key}</Text>

                          <Text className={`${textColor} text-lg`}>{value}</Text>
                        </View>
                      )
                    })}
                  </View>
                </View>
              </ScrollView>
            </View>
          </ModalWithClickOut>
        </>
      }
    </>
  );
}

function Menu({ menu, index, viewAll }: {
  menu: MenuInfo,
  index: number,
  viewAll: boolean,
}) {
  const textColor = useThemeStore(store => store.textColor);
  const bgColor = useThemeStore(store => store.bgColor);

  return (
    <View key={menu.category}>
      <View className={`rounded-xl overflow-hidden ${bgColor} ${index > 0 && !viewAll && "ml-3"} border-2 border-white`}>
        <Text className={`text-xl font-semibold ${textColor} bg-blue-500 p-2`}>
          {menu.category} ({menu.items.length})
        </Text>

        <View className={`flex ${!viewAll && "max-h-[250px]"}`}>
          <View className="flex-row justify-between p-2">
            <Text className={`${textColor} text-lg font-semibold`}>Dish</Text>
            <Text className={`${textColor} text-lg font-semibold ml-3`}>Calories</Text>
          </View>

          <View className="w-full h-0 border border-white" />
          {menu.items.map((item, index) => {
            return (
              <View key={item.name} className="flex-col">
                {index !== 0 && <View className={`w-full ${viewAll ? "h-[2px]" : "h-[0.5px]"} ${bgColor === "bg-black" ? "bg-white" : "bg-black"}`} />}
                <Item item={item} viewAll={viewAll} />
              </View>
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

function MenusScrollable({ category: station, viewAll }: {
  category: StationInfo,
  viewAll: boolean,
}) {

  return <ScrollView horizontal={!viewAll} className={`my-2`}>
    {station.menu.map((menu, index) => {
      return (
        <Menu
          menu={menu}
          key={menu.category}
          index={index}
          viewAll={viewAll}
        />
      )
    })}
  </ScrollView>;
}

export default function Menus({ station }: {
  station: StationInfo;
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const textColor = useThemeStore(store => store.textColor);
  const bgColor = useThemeStore(store => store.bgColor);

  return <>
    <ModalWithClickOut
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
    >
      <View className={`${bgColor} border border-white w-5/6 h-4/6 lg:w-1/2 lg:h-4/6 p-2 inset-x-0 top-10`}>
        <MenusScrollable
          category={station}
          viewAll
        />
      </View>
    </ModalWithClickOut>
    <View key={station.station} className="p-2 rounded">
      <View className="flex-row items-center justify-between gap-4">
        <Text className={`text-2xl font-semibold ${textColor} shrink`}>
          {station.station}
        </Text>

        <Pressable
          onPress={() => setModalVisible(true)}
          className="px-4 py-2 bg-yellow-400 rounded-xl shrink-0"
        >
          <Text className="">View All</Text>
        </Pressable>
      </View>

      <MenusScrollable
        category={station}
        viewAll={false}
      />
    </View>
  </>;
}