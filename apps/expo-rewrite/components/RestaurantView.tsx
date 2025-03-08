import React, { forwardRef, useCallback, useContext } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { FlashList } from "@shopify/flash-list";

import { useThemeColor } from "../hooks/useThemeColor";
import {
  Dish,
  Menu,
  RestaurantName,
  Station,
  useZotmealQuery,
  useZotmealStore,
} from "../hooks/useZotmealStore";
import { stringToColor } from "../utils/color";
import { formatEventDateRange } from "../utils/date";
import { getDishRating } from "../utils/dish";
import BottomSheet, { BottomSheetRefProps } from "./BottomSheet";
import { Calendar } from "./Calendar";
import { DishDetails } from "./DishDetails";
import ParallaxScrollView from "./ParallaxScrollView";
import { RestaurantContext } from "./RestaurantContext";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { IconSymbol } from "./ui/IconSymbol";

const dishButtonWidth = 120;

const StationCarousel = forwardRef<BottomSheetRefProps, { station: Station }>(
  ({ station }, ref) => {
    const sortedDishes = station.dishes.sort((a, b) =>
      a.category.localeCompare(b.category),
    );

    return (
      <View>
        <ThemedText
          type="defaultSemiBold"
          style={{
            fontSize: 20,
            marginLeft: 10,
            marginTop: 0,
          }}
        >
          {station.name}
        </ThemedText>
        <Carousel
          style={{
            width: "100%",
          }}
          data={sortedDishes}
          width={dishButtonWidth}
          height={190}
          loop={false}
          overscrollEnabled={false}
          scrollAnimationDuration={200}
          onConfigurePanGesture={(gestureChain) =>
            gestureChain.activeOffsetX([-10, 10])
          }
          renderItem={({ index }) => (
            <DishButton
              key={sortedDishes[index].id}
              dish={sortedDishes[index]}
              ref={ref}
            />
          )}
        />
      </View>
    );
  },
);

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

const DishButton = forwardRef<BottomSheetRefProps, { dish: Dish }>(
  ({ dish }, ref) => {
    const { setSelectedItem } = useZotmealStore();
    const { height } = useWindowDimensions();
    const { image, skeletonValue } = useContext(RestaurantContext)!;
    const textColor = useThemeColor({}, "text");

    const handlePress = useCallback(() => {
      setSelectedItem({ ...dish, type: "Dish" });
      const currentRef = typeof ref === "function" ? null : ref?.current;
      if (!currentRef) return;
      if (currentRef.isActive()) {
        currentRef.scrollTo(0);
      } else {
        currentRef.scrollTo(-height / 2.25);
      }
    }, []);

    const color = stringToColor(dish.category);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: interpolateColor(
          skeletonValue.value,
          [0, 1],
          [`${color}55`, "#00000000"],
        ),
      };
    });

    return (
      <TouchableOpacity onPress={handlePress}>
        <View
          style={{
            width: dishButtonWidth,
            alignItems: "center",
            padding: 5,
            borderRadius: 5,
          }}
        >
          <AnimatedImageBackground
            source={image}
            imageStyle={[
              {
                width: dishButtonWidth,
              },
              animatedStyle,
            ]}
            style={[
              {
                height: dishButtonWidth * 0.9,
                aspectRatio: 1,
                borderRadius: 5,
                marginHorizontal: 5,
                justifyContent: "flex-end",
                overflow: "hidden",
              },
              animatedStyle,
            ]}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  backgroundColor: color,
                  width: 3,
                  height: dishButtonWidth * 0.15,
                  marginRight: 3,
                }}
              />
              <ThemedText
                type="defaultSemiBold"
                style={{
                  fontSize: 13,
                  color: "white",
                }}
              >
                {dish.category}
              </ThemedText>
            </View>
            <View style={{ backgroundColor: color, height: 5, marginTop: 2 }} />
          </AnimatedImageBackground>
          <View
            style={{
              width: "90%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingTop: 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 1,
              }}
            >
              <IconSymbol name="star.fill" color={textColor} size={13} />
              <ThemedText
                type="default"
                style={{
                  fontSize: 11,
                }}
              >
                {getDishRating(dish)}
              </ThemedText>
            </View>
            <ThemedText
              type="default"
              style={{
                fontSize: 11,
                paddingTop: 1.5,
              }}
            >
              {dish.nutritionInfo.calories ?? "n/a"} cal
            </ThemedText>
          </View>
          <View
            style={{
              width: "90%",
              height: 1,
              backgroundColor: "grey",
              opacity: 0.2,
              marginVertical: 3,
            }}
          />
          <ThemedText
            style={{
              fontSize: 11,
              textAlign: "left",
              width: "90%",
              lineHeight: 14,
              marginTop: 0,
            }}
          >
            {dish.name}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  },
);

function EventDetails() {
  const { selectedItem: event } = useZotmealStore();
  const secondaryBackgroundColor = useThemeColor({}, "secondaryBackground");
  const { width, height } = useWindowDimensions();

  if (!event || event.type !== "Event") return null;

  return (
    <ThemedView
      style={{
        flex: 1,
        borderRadius: 25,
        padding: 20,
      }}
    >
      <ThemedText
        type="defaultSemiBold"
        style={{
          fontSize: 20,
        }}
      >
        {event.title}
      </ThemedText>
      <View
        style={{
          width: "100%",
          height: 1,
          marginVertical: 4,
          backgroundColor: secondaryBackgroundColor,
        }}
      />
      <ThemedText
        style={{
          fontSize: 13,
          fontWeight: "semibold",
          textAlign: "left",
        }}
      >
        {formatEventDateRange(event)}
      </ThemedText>
      <ThemedText
        style={{
          fontSize: 13,
          marginTop: 10,
          backgroundColor: secondaryBackgroundColor,
          fontWeight: 600,
          padding: 10,
          borderRadius: 10,
          lineHeight: 16,
        }}
      >
        {event.longDescription?.trim() ??
          event.shortDescription?.trim() ??
          "No description available."}
      </ThemedText>
      <Image
        source={{ uri: event.image! }}
        style={{
          width: "90%",
          height: height / 4,
          margin: "auto",
          borderWidth: 1,
          borderColor: "white",
        }}
      />
    </ThemedView>
  );
}

function MenuButton({
  menu,
  setSelectedMenu,
  active,
}: {
  menu: Menu;
  setSelectedMenu: (menu: Menu) => void;
  active: boolean;
}) {
  const secondaryBackgroundColor = useThemeColor({}, "secondaryBackground");

  return (
    <TouchableOpacity onPress={() => setSelectedMenu(menu)}>
      <View
        style={[
          {
            borderRadius: 25,
            paddingVertical: 5,
            paddingHorizontal: 15,
            width: "auto",
            borderWidth: 2,
            borderColor: secondaryBackgroundColor,
            backgroundColor: active ? secondaryBackgroundColor : "transparent",
          },
        ]}
      >
        <ThemedText>{menu.period.name}</ThemedText>
      </View>
    </TouchableOpacity>
  );
}

function LoadIndicator() {
  const { width, height } = useWindowDimensions();

  return (
    <View
      style={{
        width: "100%",
        height: height / 2,
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <ActivityIndicator style={{ marginTop: 50 }} />
    </View>
  );
}

export default function RestaurantView({
  restaurantName,
}: {
  restaurantName: RestaurantName;
}) {
  const sheetRef = React.useRef<BottomSheetRefProps>(null);

  const { width, height } = useWindowDimensions();

  const [date, setDate] = React.useState<Date>(new Date());
  const [selectedMenu, setSelectedMenu] = React.useState<Menu | null>(null);
  const { setSelectedItem } = useZotmealStore();
  const { data, error, isFetching } = useZotmealQuery(date);

  const skeletonValue = useSharedValue(0);

  React.useEffect(() => {
    skeletonValue.value = withRepeat(
      withTiming(1, { duration: 700 }),
      -1,
      true,
    );
  }, []);

  React.useEffect(() => {
    if (!data) return;
    const restaurant =
      restaurantName === "anteatery" ? data.anteatery : data.brandywine;
    setSelectedMenu(restaurant.menus[0]);
  }, [data]);

  // TODO: better error handling & retry functionality
  if (error)
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "red" }}>{error.message}</Text>
      </View>
    );

  // Store restaurant-specific data in a config object to keep things organized.
  const brandywineConfig = {
    restaurantName: "brandywine" as const,
    image: require("~/assets/brandywine.png"),
    data: data?.brandywine,
  };
  const anteateryConfig = {
    restaurantName: "anteatery" as const,
    image: require("~/assets/anteatery.jpg"),
    data: data?.anteatery,
  };

  const config =
    restaurantName === "anteatery" ? anteateryConfig : brandywineConfig;

  return (
    <RestaurantContext.Provider
      value={{
        ...config,
        skeletonValue,
      }}
    >
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={
          <Image source={config.image} style={{ width, height: 300 }} />
        }
      >
        <Calendar date={date} setDate={setDate} />
        {isFetching || !data ? (
          <LoadIndicator />
        ) : (
          <>
            <ScrollView
              horizontal
              contentContainerStyle={{
                flex: 1,
                width: "auto",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                {(config.data?.menus ?? []).map((menu) => (
                  <MenuButton
                    menu={menu}
                    setSelectedMenu={setSelectedMenu}
                    active={menu === selectedMenu}
                  />
                ))}
              </View>
            </ScrollView>
            <FlashList
              data={selectedMenu?.stations ?? []}
              estimatedItemSize={209}
              renderItem={({ item }) => (
                <StationCarousel station={item} ref={sheetRef} />
              )}
            />
            <ThemedText
              type="defaultSemiBold"
              style={{
                fontSize: 20,
                marginLeft: 10,
              }}
            >
              Events
            </ThemedText>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 10,
                paddingHorizontal: 10,
              }}
            >
              {config.data?.events.map((event) => (
                <TouchableOpacity
                  key={event.title}
                  onPress={() => {
                    setSelectedItem({ ...event, type: "Event" });
                    if (!sheetRef.current) return;
                    if (sheetRef.current.isActive()) {
                      sheetRef.current.scrollTo(0);
                    } else {
                      sheetRef.current.scrollTo(-height / 2.25);
                    }
                  }}
                >
                  <ImageBackground
                    source={{ uri: event.image! }}
                    blurRadius={50}
                    style={{
                      width: width / 2.5,
                      aspectRatio: 1,
                      justifyContent: "center",
                      padding: 6,
                      borderRadius: 6,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#11111155",
                        borderRadius: 5,
                        paddingHorizontal: 8,
                        paddingVertical: 5,
                      }}
                    >
                      <ThemedText
                        type="defaultSemiBold"
                        style={{
                          width: "90%",
                          color: "white",
                          fontSize: 12,
                          textAlign: "left",
                          marginTop: 5,
                        }}
                      >
                        {event.title}
                      </ThemedText>
                      <View
                        style={{
                          width: "90%",
                          height: 1,
                          marginVertical: 4,
                          backgroundColor: "white",
                        }}
                      />
                      <ThemedText
                        style={{
                          width: "90%",
                          color: "white",
                          marginTop: 0,
                          fontSize: 9,
                          textAlign: "left",
                        }}
                      >
                        {formatEventDateRange(event)}
                      </ThemedText>
                    </View>
                    <ImageBackground
                      source={{ uri: event.image! }}
                      resizeMode="contain"
                      imageStyle={{
                        borderRadius: 10,
                        width: "100%",
                      }}
                      style={{
                        marginTop: 10,
                        width: "90%",
                        height: "70%",
                        margin: "auto",
                      }}
                    />
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ParallaxScrollView>
      <BottomSheet ref={sheetRef}>
        <DishDetails />
        <EventDetails />
      </BottomSheet>
    </RestaurantContext.Provider>
  );
}
