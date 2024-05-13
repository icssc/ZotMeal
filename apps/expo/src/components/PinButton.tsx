import type { GetProps } from "tamagui";
import React, { useEffect, useState } from "react";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { Pin, PinOff } from "@tamagui/lucide-icons";
import { Button, Text, XStack } from "tamagui";

interface PinButtonProps extends GetProps<typeof Button> {
  dishName: string;
}

export default function PinButton({ dishName, ...props }: PinButtonProps) {
  const [pinnedItems, setPinnedItems] = useState<Record<string, boolean>>({});
  const { getItem, setItem } = useAsyncStorage("pinnedItems");

  const writeItemToStorage = async (newValue: Record<string, boolean>) => {
    await setItem(JSON.stringify(newValue));
    setPinnedItems(newValue);
  };

  useEffect(() => {
    const readItemFromStorage = async () => {
      const item = await getItem();
      if (!item) return;

      const parsedItem = JSON.parse(item) as Record<string, boolean>;

      setPinnedItems(parsedItem);
    };

    readItemFromStorage().catch(console.error);
  }, [getItem]);

  return (
    <Button
      {...props}
      onPress={() =>
        writeItemToStorage({
          ...pinnedItems,
          [dishName]: !pinnedItems[dishName],
        })
      }
    >
      {pinnedItems[dishName] ? (
        <XStack alignItems="center">
          <Text fontWeight="800">Unpin </Text>
          <PinOff />
        </XStack>
      ) : (
        <XStack alignItems="center">
          <Text fontWeight="800">Pin </Text>
          <Pin />
        </XStack>
      )}
    </Button>
  );
}
