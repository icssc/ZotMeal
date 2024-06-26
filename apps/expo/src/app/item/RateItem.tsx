import { useState } from "react";
import { Star, StarFull } from "@tamagui/lucide-icons";
import { Adapt, Button, H4, Popover, Text, XStack, YStack } from "tamagui";

import type { DishWithRelations } from "@zotmeal/db";

export default function RateItem({
  item,
}: Readonly<{ item: DishWithRelations }>) {
  // const [rating, setRating] = useState<number>(item.rating ?? 0);
  const [rating, setRating] = useState<number>(0);
  const [isAuthenticated] = useState<boolean>(true); // TODO: replace with actual auth check
  const [userRated, setUserRated] = useState<boolean>(false); // TODO: replace with actual user rating check

  return (
    <Popover placement="bottom" allowFlip>
      <Popover.Trigger asChild width="28%">
        <Button
          fontWeight="bold"
          borderRadius="$10"
          paddingHorizontal="unset"
          icon={<StarFull color="gold" size="$1" />}
        >
          5.0
          <Text color="gray" fontWeight="normal">
            (10,000 reviews)
          </Text>
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
        <Popover.Arrow borderWidth={1} borderColor="$borderColor" />
        <YStack gap="$6" alignItems="center">
          <H4>Rate {item.name}</H4>
          <XStack gap="$5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Button
                unstyled
                key={i}
                onPress={() => setRating(i + 1)}
                icon={
                  i < rating ? (
                    <StarFull size="$3" color={userRated ? "gold" : "gray"} />
                  ) : (
                    <Star size="$3" color={userRated ? "gold" : "gray"} />
                  )
                }
              />
            ))}
          </XStack>
          <Popover.Close asChild>
            <Button
              disabled={!isAuthenticated || !rating}
              opacity={rating ? 1 : 0.5}
              size="$5"
              fontWeight="800"
              paddingHorizontal="$5"
              borderRadius="$10"
              onPress={() => {
                /* Custom code goes here, does not interfere with popover closure */
                // TODO: submit rating
                setUserRated(true);
              }}
            >
              {isAuthenticated
                ? userRated
                  ? "Resubmit"
                  : "Submit"
                : "Login to Rate"}
            </Button>
          </Popover.Close>
        </YStack>
      </Popover.Content>
    </Popover>
  );
}
