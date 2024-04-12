import { View, Image, H3 } from 'tamagui';

export default function Logo() {
  return (
    <View flexDirection="row">
      <Image
        resizeMode="contain"
        alignSelf="center"
        source={{
          width: 43,
          height: 43,
          // uri: "https://www.clipartmax.com/png/middle/432-4326703_uci-peter-the-anteater-sticker.png"
          uri: "https://c.tenor.com/MBn4pz0PYgMAAAAd/tenor.gif"
        }} />
      <H3
        color="white"
        fontWeight={"800"}
      >
        ZotMeal
      </H3>
    </View>
  );
}
