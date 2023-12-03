import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Button,
  Image,
  Pressable,
  Text,
  View,
  type ImageSourcePropType,
} from "react-native";
import { Link } from 'expo-router';
import Carousel, {
  type ICarouselInstance,
} from "react-native-reanimated-carousel";
import { IS_WEB, type Restaurant } from "../../lib/constants";
import type { CarouselRenderItemInfo } from "react-native-reanimated-carousel/lib/typescript/types";
import { useRestaurantStore } from "../../stores/restaurant";
import { useThemeStore } from "../../stores/theme";
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';

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
  const [restaurant, setRestaurant] = useRestaurantStore((store) => [store.restaurant, store.setRestaurant]);

  const width = useThemeStore((store) => store.width);

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

  const defaultIndex = useMemo(() => {
    const index = banners.findIndex((banner) => banner.name === restaurant);
    return index === -1 ? 0 : index;
  }, [restaurant]);

  const onProgressChange = useCallback(
    (_animationProgress: number, absoluteProgress: number) => {
      if (!Number.isInteger(absoluteProgress)) {
        return;
      }

      const index = Math.round(absoluteProgress);
      const currentBanner = banners[index];

      if (currentBanner != null) {
        setRestaurant(currentBanner.name);
      }
    },
    [],
  );

  return (
    <View className="relative">
      <View className="w-full h-12 p-2 bg-black/70 absolute z-10 flex-row justify-between items-center">
        <View className="flex flex-row items-center gap-2">
          <View className="w-4 h-4 bg-red-400 rounded-full" />
          <Text className="text-white text-lg font-bold">Closed Now</Text>
        </View>

        <View className="flex-row gap-4">
          <Link href={`/schedule/${restaurant}`}>
            <Pressable>
              <AntDesign name="calendar" size={24} color="white" />
            </Pressable>
          </Link>
          <FontAwesome name="dollar" size={24} color="white" />
          <Feather name="map-pin" size={24} color="white" />
        </View>
      </View>

      <View className="justify-center items-center" style={{ width }}>
        <Carousel
          width={width}
          height={200}
          onProgressChange={onProgressChange}
          defaultIndex={defaultIndex}
          data={banners}
          ref={ref}
          renderItem={renderItem}
        />
      </View>

      {IS_WEB && (
        <View className="p-2 my-2 flex-row self-end gap-2">
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
