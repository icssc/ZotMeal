import { useState } from "react";
import { StarFull } from "@tamagui/lucide-icons";
import { Adapt, Button, H4, Popover, XStack, YStack } from "tamagui";

import type { DishWithRelations } from "@zotmeal/db";

export default function RateItem({
  item,
}: Readonly<{ item: DishWithRelations }>) {
  const [rating, setRating] = useState<number>(5);

  return (
    <Popover placement="bottom">
      <Popover.Trigger asChild width={"28%"}>
        <Button
          fontWeight={"800"}
          borderRadius="$10"
          paddingHorizontal="unset"
          icon={<StarFull color="gold" size="$1" />}
        >
          5.0
        </Button>
      </Popover.Trigger>
      <Adapt when={"sm" as unknown as undefined} platform="touch">
        <Popover.Sheet modal dismissOnSnapToBottom snapPoints={[30]}>
          <Popover.Sheet.Frame padding="$4">
            <Adapt.Contents />
          </Popover.Sheet.Frame>
          <Popover.Sheet.Overlay
            animation="quickest"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Popover.Sheet>
      </Adapt>
      <Popover.Content
        borderWidth={1}
        borderColor="$borderColor"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        elevate
        animation={[
          "quickest",
          {
            opacity: {
              overshootClamping: true,
            },
          },
        ]}
      >
        <YStack gap="$6" alignItems="center">
          <H4>Rate {item.name}</H4>
          <XStack gap="$5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Button
                unstyled
                key={i}
                onPress={() => setRating(i + 1)}
                icon={
                  <StarFull size={"$3"} color={i < rating ? "gold" : "gray"} />
                }
              />
            ))}
          </XStack>
          <Popover.Close asChild>
            <Button
              size="$5"
              fontWeight={"800"}
              paddingHorizontal="$5"
              borderRadius="$10"
              onPress={() => {
                /* Custom code goes here, does not interfere with popover closure */
                // TODO: submit rating
              }}
            >
              Submit
            </Button>
          </Popover.Close>
        </YStack>
      </Popover.Content>
    </Popover>
  );
}
