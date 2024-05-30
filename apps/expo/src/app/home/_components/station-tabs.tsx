import { H3, ScrollView, Tabs, Text, View, YGroup, YStack } from "tamagui";

import type { MenuWithRelations } from "@zotmeal/db";

import { groupBy } from "~/utils";
import { DishCard } from "./dish-card";

type Station = MenuWithRelations["stations"][0];
type Dish = MenuWithRelations["stations"][0]["dishes"][0];

export const StationTabs = ({
  stations,
}: Readonly<{ stations: Station[] }>) => (
  <Tabs
    defaultValue={stations?.[0]?.name}
    orientation="horizontal"
    flexDirection="column"
    width="100%"
    height="100%"
  >
    <Tabs.List>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {stations.map((station) => (
          <Tabs.Tab
            key={station.name}
            flex={1}
            value={station.name}
            borderRadius="$10"
            height="$3"
            marginHorizontal="$1"
            marginBottom="$3"
          >
            <Text fontSize="$5">{station.name}</Text>
          </Tabs.Tab>
        ))}
      </ScrollView>
    </Tabs.List>

    {stations.map((station) => (
      <Tabs.Content key={station.name} value={station.name}>
        <ScrollView
          padding="$2"
          contentContainerStyle={{
            alignItems: "center",
          }}
        >
          {/* group dishes by category */}
          {Object.entries(
            groupBy(station.dishes, (dish) => dish.category as keyof Dish),
          ).map(([category, dishes]) => (
            <Category
              key={category}
              stationId={station.id}
              category={category}
              dishes={dishes}
            />
          ))}
          <View height={200} />
        </ScrollView>
      </Tabs.Content>
    ))}
  </Tabs>
);

const Category = ({
  stationId,
  category,
  dishes,
}: Readonly<{
  stationId: Station["id"];
  category: string;
  dishes: Dish[];
}>) => (
  <YStack key={category} width="100%">
    <H3 fontWeight="800" marginTop="$5" paddingLeft="$2">
      {category}
    </H3>
    <YGroup rowGap={1}>
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} stationId={stationId} />
      ))}
    </YGroup>
  </YStack>
);
