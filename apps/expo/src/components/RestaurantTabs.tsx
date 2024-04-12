import { Image, Tabs, View } from 'tamagui';
import type { RestaurantName } from '~/app/home';
import { TabSvg, useMenuStore } from '~/app/home';

export default function RestaurantTabs({ children }: {
  children: React.ReactNode
}) {
  const {
    selectedRestaurant,
    setSelectedRestaurant,
  } = useMenuStore();

  return (
    <>
      <Image
        source={{
          uri: selectedRestaurant === "brandywine" ?
            "https://s3-media0.fl.yelpcdn.com/bphoto/P0DIhR8cO-JxYygc3V3aaQ/348s.jpg" :
            "https://images.rsmdesign.com/7321bb55-579f-47fd-9f27-a6abf3e9826e.jpg"
        }}
        position='absolute'
        zIndex={-1}
        width={"100%"}
        height={125}
      />
      <View height={65} />
      <Tabs
        value={selectedRestaurant}
        onValueChange={(value) => setSelectedRestaurant(value as RestaurantName)}
        orientation="horizontal"
        flexDirection="column"
        width={"100%"}
        height={"100%"}
      >
        <Tabs.List borderRadius={"$20"} flexDirection='column'>
          <View width={"100%"} flexDirection='row'>
            <Tabs.Tab flex={1} height={70} value="brandywine" opacity={selectedRestaurant === "brandywine" ? 1 : 0.5}>
              <TabSvg label={"Brandywine"} />
            </Tabs.Tab>
            <Tabs.Tab flex={1} height={70} value="anteatery" opacity={selectedRestaurant === "anteatery" ? 1 : 0.5}>
              <TabSvg label={"The Anteatery"} />
            </Tabs.Tab>
          </View>
        </Tabs.List>
        {children}
      </Tabs>
    </>
  );
}
