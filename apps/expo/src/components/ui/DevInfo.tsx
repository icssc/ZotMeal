import React from "react";
import { Platform } from "react-native";
import { Info } from "@tamagui/lucide-icons";
import { Button, Text, View } from "tamagui";

import { getBaseUrl } from "~/utils/api";
import { env } from "~/utils/env";

export function DevInfo() {
  const [open, setOpen] = React.useState(false);

  return (
    <View
      onPress={() => setOpen(!open)}
      zIndex={10}
      width={open ? "60%" : "10%"}
      height={open ? "25%" : "10%"}
      position="absolute"
      bottom={30}
      right={10}
    >
      {open ? (
        <Button
          unstyled
          width="100%"
          height="100%"
          backgroundColor="red"
          padding="$4"
        >
          <Text fontSize="$3" fontWeight="bold">
            Platform.OS: {Platform.OS}
            {"\n"}
            baseurl: {getBaseUrl()}
            {"\n"}
            env: {JSON.stringify(env, null, 2)}
          </Text>
        </Button>
      ) : (
        <Info size="$5" color="red" />
      )}
    </View>
  );
}
