import { useColorScheme } from "react-native";
import { G, Path, Svg, Text } from "react-native-svg";
import { Image, Tabs, useTheme, useWindowDimensions, View } from "tamagui";

import type { Restaurant } from "@zotmeal/db";
import { getCurrentPeriodName } from "@zotmeal/utils";

import useZotmealStore from "~/utils/useZotmealStore";

export default function RestaurantTabs({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { selectedRestaurant, setSelectedRestaurant } = useZotmealStore();

  return (
    <>
      <Image
        source={{
          uri:
            selectedRestaurant === "brandywine"
              ? "https://s3-media0.fl.yelpcdn.com/bphoto/P0DIhR8cO-JxYygc3V3aaQ/348s.jpg"
              : "https://images.rsmdesign.com/7321bb55-579f-47fd-9f27-a6abf3e9826e.jpg",
        }}
        position="absolute"
        zIndex={-1}
        width={"100%"}
        height={125}
      />
      <View height={65} />
      <Tabs
        value={selectedRestaurant}
        onValueChange={(value) =>
          setSelectedRestaurant(value as Restaurant["name"])
        }
        orientation="horizontal"
        flexDirection="column"
        width={"100%"}
        height={"100%"}
      >
        <Tabs.List borderRadius={"$20"} flexDirection="column">
          <View width={"100%"} flexDirection="row">
            <Tabs.Tab
              flex={1}
              height={70}
              value="brandywine"
              opacity={selectedRestaurant === "brandywine" ? 1 : 0.5}
            >
              <TabSvg label={"Brandywine"} />
            </Tabs.Tab>
            <Tabs.Tab
              flex={1}
              height={70}
              value="anteatery"
              opacity={selectedRestaurant === "anteatery" ? 1 : 0.5}
            >
              <TabSvg label={"The Anteatery"} />
            </Tabs.Tab>
          </View>
        </Tabs.List>
        {children}
      </Tabs>
    </>
  );
} // Uses the svg from Figma

export const TabSvg = ({ label }: Readonly<{ label: string }>) => {
  const colorScheme = useColorScheme();
  const theme = useTheme();
  const deviceWidth = useWindowDimensions().width;

  return (
    <Svg
      width={deviceWidth / 2 + 135}
      height="75"
      viewBox="0 0 403 82"
      fill="none"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M-31 82H403C370.624 82 359.956 61.6562 349.248 41.2347C338.458 20.6568 327.626 0 294.5 0H77.5C44.374 0 33.5423 20.6568 22.7519 41.2347C12.0436 61.6562 1.37595 82 -31 82Z"
        fill={colorScheme === "dark" ? "#1A1B1D" : "#FFFFFF"}
      />
      <G>
        <Text
          x="50%"
          y="30%"
          fill={theme.color?.val as string}
          textAnchor="middle"
          alignmentBaseline="central"
          fontSize="25"
          fontWeight="bold"
        >
          {label}
        </Text>
        <Text
          x="50%"
          y="60%"
          fill={
            getCurrentPeriodName() === "closed" ? "firebrick" : "forestgreen"
          }
          textAnchor="middle"
          alignmentBaseline="central"
          fontSize="18"
          fontWeight="bold"
        >
          {getCurrentPeriodName() === "closed" ? "CLOSED" : "OPEN"}
        </Text>
      </G>
    </Svg>
  );
};
