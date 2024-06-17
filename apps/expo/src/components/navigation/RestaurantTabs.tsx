import { G, Path, Svg, Text } from "react-native-svg";
import {
  GetProps,
  Image,
  Tabs,
  useTheme,
  useWindowDimensions,
  View,
} from "tamagui";

import { RestaurantInfo, useZotmealColorScheme } from "~/utils";

export function RestaurantTabs({
  restaurant,
  setRestaurant,
  anteateryStatus,
  brandywineStatus,
  children,
}: Readonly<{
  restaurant: RestaurantInfo["name"];
  setRestaurant: (value: RestaurantInfo["name"]) => void;
  anteateryStatus: "closed" | "open";
  brandywineStatus: "closed" | "open";
  children: React.ReactNode;
}>) {
  type ImageProps = GetProps<typeof Image>;

  // TODO: maybe scale each image accordingly
  const imageProps = [
    {
      source: {
        uri: "https://s3-media0.fl.yelpcdn.com/bphoto/P0DIhR8cO-JxYygc3V3aaQ/348s.jpg",
      },
      display: restaurant === "brandywine" ? "block" : "none",
    },
    {
      source: {
        uri: "https://images.rsmdesign.com/7321bb55-579f-47fd-9f27-a6abf3e9826e.jpg",
      },
      display: restaurant === "anteatery" ? "block" : "none",
    },
  ] as const satisfies ImageProps[];

  return (
    <>
      {imageProps.map((props, index) => (
        <Image
          {...props}
          key={index}
          position="absolute"
          zIndex={-1}
          width="100%"
          height={125}
        />
      ))}
      <View height={65} />
      <Tabs
        value={restaurant}
        onValueChange={(value) =>
          setRestaurant(value as RestaurantInfo["name"])
        }
        orientation="horizontal"
        flexDirection="column"
        width="100%"
        height="100%"
      >
        <Tabs.List borderRadius="$20" flexDirection="column">
          <View width="100%" flexDirection="row">
            <Tabs.Tab
              flex={1}
              height={70}
              value="brandywine"
              opacity={restaurant === "brandywine" ? 1 : 0.5}
            >
              <TabSvg title="Brandywine" status={brandywineStatus} />
            </Tabs.Tab>
            <Tabs.Tab
              flex={1}
              height={70}
              value="anteatery"
              opacity={restaurant === "anteatery" ? 1 : 0.5}
            >
              <TabSvg title="The Anteatery" status={anteateryStatus} />
            </Tabs.Tab>
          </View>
        </Tabs.List>
        {children}
      </Tabs>
    </>
  );
} // Uses the svg from Figma

export const TabSvg = ({
  title,
  status,
}: Readonly<{
  title: string;
  status: "closed" | "open";
}>) => {
  const colorScheme = useZotmealColorScheme();
  const theme = useTheme();
  const { width } = useWindowDimensions();

  return (
    <Svg width={width / 2 + 135} height="75" viewBox="0 0 403 82" fill="none">
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
          fontFamily="Inter"
          fontSize="25"
          fontWeight="bold"
        >
          {title}
        </Text>
        <Text
          x="50%"
          y="60%"
          fill={status === "closed" ? "firebrick" : "forestgreen"}
          textAnchor="middle"
          alignmentBaseline="central"
          fontFamily="Inter"
          fontSize="18"
          fontWeight="bold"
        >
          {status.toUpperCase()}
        </Text>
      </G>
    </Svg>
  );
};
