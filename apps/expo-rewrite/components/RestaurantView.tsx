import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
} from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";

import { useThemeColor } from "../hooks/useThemeColor";
import { colorShade, getContrastText, stringToColor } from "../utils/color";
import { formatEventDateRange } from "../utils/date";
import {
  Dish,
  Menu,
  RestaurantInfo,
  RestaurantName,
  Station,
  useZotmealQuery,
  useZotmealStore,
} from "../utils/useZotmealStore";
import BottomSheet, { BottomSheetRefProps } from "./BottomSheet";
import { Calendar } from "./Calendar";
import { NutritionFacts } from "./NutritionFacts";
import ParallaxScrollView from "./ParallaxScrollView";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

const dishButtonWidth = 120;

const StationCarousel = forwardRef<BottomSheetRefProps, { station: Station }>(
  ({ station }, ref) => {
    // TODO: use Select type instead of bangs
    const sortedDishes = station.dishes.sort((a, b) =>
      a.category!.localeCompare(b.category!),
    );

    return (
      <View>
        <ThemedText
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 10,
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
          height={180}
          loop={false}
          overscrollEnabled={false}
          scrollAnimationDuration={200}
          onConfigurePanGesture={(gestureChain) =>
            gestureChain.activeOffsetX([-10, 10])
          }
          renderItem={({ index }) => (
            <DishButton key={index} dish={sortedDishes[index]} ref={ref} />
          )}
        />
      </View>
    );
  },
);

const DishButton = forwardRef<BottomSheetRefProps, { dish: Dish }>(
  ({ dish }, ref) => {
    const { setSelectedItem } = useZotmealStore();
    const { height } = useWindowDimensions();

    const { image } = useContext(RestaurantContext)!;

    const handlePress = useCallback(() => {
      setSelectedItem(dish);
      const currentRef = typeof ref === "function" ? null : ref?.current;
      if (!currentRef) return;
      if (currentRef.isActive()) {
        currentRef.scrollTo(0);
      } else {
        currentRef.scrollTo(-height / 2.25);
      }
    }, []);

    // TODO: use Select type
    const color = stringToColor(dish.category!);

    // TODO: use Select type instead of bangs
    const rating =
      dish.numRatings === 0 ? 0 : dish.totalRating! / dish.numRatings!;

    return (
      <TouchableOpacity onPress={handlePress}>
        <View
          key={dish.name}
          style={{
            width: dishButtonWidth,
            alignItems: "center",
            padding: 5,
            borderRadius: 5,
          }}
        >
          <ImageBackground
            source={image}
            imageStyle={{
              width: dishButtonWidth,
            }}
            style={{
              height: dishButtonWidth * 0.9,
              aspectRatio: 1,
              borderRadius: 5,
              marginHorizontal: 5,
              justifyContent: "flex-end",
              overflow: "hidden",
            }}
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
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "white",
                }}
              >
                {dish.category}
              </Text>
            </View>
            <View style={{ backgroundColor: color, height: 5, marginTop: 2 }} />
          </ImageBackground>
          <ThemedText
            style={{
              fontWeight: 500,
              fontSize: 11,
              textAlign: "left",
              width: "90%",
              paddingTop: 2,
            }}
          >
            {dish.name}
          </ThemedText>
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
              fontWeight: "semibold",
              fontSize: 11,
              textAlign: "left",
              width: "90%",
            }}
          >
            ★ {rating}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  },
);

function DishDetails() {
  const { selectedItem: dish } = useZotmealStore();

  // ! Brittle typeguard
  if (!dish || "start" in dish) return null;
  const categoryColor = stringToColor(dish?.category!);
  const textColor = getContrastText(categoryColor);

  // TODO: use Select type instead of bangs
  const rating =
    dish.numRatings === 0 ? 0 : dish.totalRating! / dish.numRatings!;

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: categoryColor,
          borderRadius: 25,
          padding: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: getContrastText(categoryColor),
              fontWeight: 700,
              fontSize: 20,
              width: "50%",
            }}
          >
            {dish.name}
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              style={{
                padding: 5,
                paddingHorizontal: 10,
                borderRadius: 25,
                backgroundColor: colorShade(categoryColor, -20),
              }}
            >
              <Text style={{ color: textColor, fontWeight: "bold" }}>
                ★ {rating}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 5,
                paddingHorizontal: 10,
                borderRadius: 25,
                backgroundColor: colorShade(categoryColor, -20),
              }}
            >
              <Text>📌</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            height: 2,
            backgroundColor: colorShade(categoryColor, -20),
            borderRadius: 25,
            marginVertical: 5,
          }}
        />
        <Text
          style={{
            color: textColor,
            backgroundColor: colorShade(categoryColor, -20),
            marginTop: 10,
            fontWeight: 600,
            padding: 10,
            borderRadius: 10,
          }}
        >
          {dish.description.trim() === ""
            ? "No description available."
            : dish.description}
        </Text>
        <ScrollView
          contentContainerStyle={{
            width: 250,
            alignItems: "center",
            margin: "auto",
            marginTop: 20,
          }}
        >
          <NutritionFacts
            nutritionInfo={dish.nutritionInfo}
            color={textColor}
          />
        </ScrollView>
      </View>
    </>
  );
}

function EventDetails() {
  const { selectedItem: event } = useZotmealStore();

  const secondaryBackgroundColor = useThemeColor({}, "secondaryBackground");
  const { width, height } = useWindowDimensions();

  // ! Brittle typeguard
  if (!event || "stationId" in event) return null;

  return (
    <ThemedView
      style={{
        flex: 1,
        borderRadius: 25,
        padding: 20,
      }}
    >
      <ThemedText
        style={{
          fontSize: 20,
          fontWeight: "bold",
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
          fontSize: 12,
          fontWeight: "semibold",
          textAlign: "left",
        }}
      >
        {formatEventDateRange(event)}
      </ThemedText>
      <ThemedText
        style={{
          fontSize: 12,
          marginTop: 10,
          backgroundColor: secondaryBackgroundColor,
          fontWeight: 600,
          padding: 10,
          borderRadius: 10,
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
        <ThemedText key={menu.period.name}>{menu.period.name}</ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const RestaurantContext = createContext<{
  restaurantName: RestaurantName;
  image: ImageSourcePropType;
  data?: RestaurantInfo;
} | null>(null);

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

  React.useEffect(() => {
    if (!data) return;
    const restaurant =
      restaurantName === "anteatery" ? data.anteatery : data.brandywine;
    setSelectedMenu(restaurant.menus[0]);
  }, [data]);

  function LoadIndicator() {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator />
      </View>
    );
  }

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
    <RestaurantContext.Provider value={config}>
      <GestureHandlerRootView style={{ flex: 1 }}>
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
                      key={menu.period.name}
                      menu={menu}
                      setSelectedMenu={setSelectedMenu}
                      active={menu === selectedMenu}
                    />
                  ))}
                </View>
              </ScrollView>
              {(selectedMenu?.stations ?? []).map((station) => (
                <StationCarousel
                  key={station.name}
                  station={station}
                  ref={sheetRef}
                />
              ))}
              <ThemedText
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
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
                      setSelectedItem(event);
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
                      <ThemedText
                        style={{
                          width: "80%",
                          fontSize: 12,
                          fontWeight: "bold",
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
                          width: "100%",
                          fontSize: 11,
                          fontWeight: "semibold",
                          textAlign: "left",
                        }}
                      >
                        {formatEventDateRange(event)}
                      </ThemedText>
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
      </GestureHandlerRootView>
    </RestaurantContext.Provider>
  );
}
