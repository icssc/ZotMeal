import React from "react";
import { Link } from "expo-router";
import { H3, Image, View } from "tamagui";

export function Logo() {
  return (
    <Link href="/" replace>
      <View flexDirection="row">
        <Image
          resizeMode="contain"
          alignSelf="center"
          source={{
            width: 43,
            height: 43,
            // uri: "https://www.clipartmax.com/png/middle/432-4326703_uci-peter-the-anteater-sticker.png"
            uri: "https://c.tenor.com/MBn4pz0PYgMAAAAd/tenor.gif",
          }}
        />
        <H3 color="white" fontWeight="800">
          ZotMeal
        </H3>
      </View>
    </Link>
  );
}
