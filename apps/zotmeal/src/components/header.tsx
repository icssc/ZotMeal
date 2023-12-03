import { useCallback, useMemo, useRef } from "react";
import { Button, Dimensions, Image, Platform, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { isWeb } from "../lib/constants";
import { CarouselRenderItemInfo } from "react-native-reanimated-carousel/lib/typescript/types";

const banners = [
  {
    name: "Anteatery",
    source: require("../assets/Anteatery.jpg"),
  },
  {
    name: "Brandywine",
    source: require("../assets/Brandywine.jpg"),
  },
];

export function Header() {
  const ref = useRef<ICarouselInstance>();
  const progressValue = useSharedValue(0);

  const baseOptions = useMemo(() => {
    return {
      vertical: false,
      width: Platform.OS === "web" ? 700 : Dimensions.get("window").width,
      height: 200,
    } as const;
  }, []);

  const createGoto = useCallback((index: number) => {
    return () => ref.current.scrollTo({ index, animated: true });
  }, []);

  const renderItem = useCallback(
    (info: CarouselRenderItemInfo<(typeof banners)[number]>) => {
      return (
        <View className="h-full rounded-lg overflow-hidden">
          <Image source={info.item.source} className="w-full h-full" />
        </View>
      );
    },
    [],
  );

  const onProgressChange = useCallback(
    (_: number, absoluteProgress: number) => {
      progressValue.value = absoluteProgress;
    },
    [],
  );

  return (
    <View className="mx-auto justify-center items-center max-w-4xl">
      <Carousel
        {...baseOptions}
        onProgressChange={onProgressChange}
        data={banners}
        ref={ref}
        renderItem={renderItem}
      />
      {isWeb && (
        <View className="flex-row self-end gap-2 my-1">
          {banners.map((banner, index) => {
            return (
              <View key={banner.source}>
                <Button title={banner.name} onPress={createGoto(index)} />
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
