import { useCallback, useMemo, useRef, useState } from "react";
import {
  Button,
  Dimensions,
  Image,
  type ImageSourcePropType,
  View,
} from "react-native";
import Carousel, {
  type ICarouselInstance,
} from "react-native-reanimated-carousel";
import { IS_WEB, type Restaurant } from "../../lib/constants";
import type { CarouselRenderItemInfo } from "react-native-reanimated-carousel/lib/typescript/types";
import { useRestaurantStore } from "../../stores/restaurant";
import { useThemeStore } from "../../stores/theme";

interface BannerInfo {
  name: Restaurant;
  source: ImageSourcePropType;
}

const banners: BannerInfo[] = [
  {
    name: "Anteatery",
    source: require("../../assets/Anteatery.jpg"),
  },
  {
    name: "Brandywine",
    source: require("../../assets/Brandywine.jpg"),
  },
];

export function Banner() {
  const setRestaurant = useRestaurantStore((store) => store.setRestaurant);

  const width = useThemeStore(store => store.width)

  const ref = useRef<ICarouselInstance | null>(null);

  const createGoto = useCallback((index: number) => {
    return () => {
      ref.current?.scrollTo({ index, animated: true });
    };
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
    (_animationProgress: number, absoluteProgress: number) => {
      const index = Math.round(absoluteProgress);
      const currentBanner = banners[index];

      if (currentBanner != null) {
        setRestaurant(currentBanner.name);
      }
    },
    [],
  );

  return (
    <View className="p-2 justify-center items-center" style={{ width }}>
      <Carousel
        width={width}
        height={200}
        onProgressChange={onProgressChange}
        data={banners}
        ref={ref}
        renderItem={renderItem}
      />
      {IS_WEB && (
        <View className="flex-row self-end gap-2 my-1">
          {banners.map((banner, index) => {
            return (
              <View key={banner.source.toString()}>
                <Button title={banner.name} onPress={createGoto(index)} />
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
