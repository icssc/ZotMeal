import { useState } from "react";
import { Star, StarFull } from "@tamagui/lucide-icons";
import {
  Adapt,
  Button,
  H4,
  Popover,
  Spinner,
  Text,
  XStack,
  YStack,
} from "tamagui";

import type { Dish } from "~/utils";
import { useAuthStore } from "~/utils";
import { api } from "~/utils/api";

export default function RateItem({ item }: Readonly<{ item: Dish }>) {
  const [rating, setRating] = useState<number>(0);
  const { user } = useAuthStore();

  const rateMutation = api.dish.rate.useMutation();

  // const userRated = user?.ratings.some((r) => r.dishId === item.id) ?? false;
  const userRated = false;

  return (
    <Popover placement="bottom" allowFlip>
      <Popover.Trigger asChild width="28%">
        <Button
          fontWeight="bold"
          borderRadius="$10"
          paddingHorizontal="unset"
          icon={<StarFull color="gold" size="$1" />}
        >
          {item.totalRating && item.numRatings ? (
            <>
              {item.totalRating / item.numRatings}
              /5.0
              <Text color="gray" fontWeight="normal">
                {item.numRatings} reviews
              </Text>
            </>
          ) : (
            "Rate"
          )}
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
              // disabled={!user || !rating || rateMutation.isPending}
              disabled={!rating || rateMutation.isPending}
              opacity={user && rating && !rateMutation.isPending ? 1 : 0.5}
              size="$5"
              fontWeight="800"
              paddingHorizontal="$5"
              borderRadius="$10"
              icon={rateMutation.isPending ? <Spinner /> : undefined}
              onPress={() => {
                if (!user) return;
                rateMutation.mutate({
                  dishId: item.id,
                  userId: "some-user-id",
                  rating,
                });
              }}
            >
              {rateMutation.isPending
                ? ""
                : user
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
