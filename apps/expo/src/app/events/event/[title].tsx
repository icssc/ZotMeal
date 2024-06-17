import React from "react";
import { Redirect, Stack, useGlobalSearchParams } from "expo-router";
import {
  CalendarClock,
  ChevronDown,
  Info,
  MapPin,
} from "@tamagui/lucide-icons";
import { format } from "date-fns";
import {
  Accordion,
  H3,
  Image,
  Paragraph,
  ScrollView,
  Separator,
  Square,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";

import { useZotmealStore } from "~/utils";

export default function Event() {
  const { title, restaurant } = useGlobalSearchParams();
  const { zotmeal } = useZotmealStore();

  if (!title || typeof title !== "string")
    throw new Error("title is not a string");
  if (restaurant !== "brandywine" && restaurant !== "anteatery")
    throw new Error("restaurant should be either brandywine or anteatery");

  const events = zotmeal?.[restaurant].events;

  const event = events?.find((event) => event.title === title);

  // TODO: Log error if event is not found
  if (!event) return <Redirect href="/events/" />;

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: event.title,
          headerBackTitle: "Events",
          headerTitleStyle: { color: "white" },
        }}
      />
      <ScrollView
        height="100%"
        width="100%"
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <YStack
          justifyContent="center"
          width="90%"
          maxWidth={700}
          themeInverse
          backgroundColor="$borderColor"
          borderRadius="$5"
          marginTop="$5"
        >
          <Image
            resizeMode="contain"
            source={{
              uri: event.image ?? require("../example-event-image.png"),
            }}
            minWidth={100}
            maxWidth="100%"
            height={200}
          />
        </YStack>
        <YStack padding={20} gap="$2" marginVertical="$4">
          <H3>{event.title}</H3>
          <Separator marginBottom="$2" />
          <XStack alignItems="center" padding={0} gap="$2">
            <MapPin />
            <Text fontWeight="700">
              {restaurant.charAt(0).toUpperCase() + restaurant.slice(1)}
            </Text>
          </XStack>
          <XStack alignItems="center" padding={0} gap="$2">
            <CalendarClock />
            <Text>
              {format(event.start.toString(), "LLL do p")} -{" "}
              {format(event.end.toString(), "LLL do p")}
            </Text>
          </XStack>
          <XStack alignItems="center" padding={0} gap="$2">
            <Info />
            <Text>{event.shortDescription}</Text>
          </XStack>
        </YStack>
        <Accordion overflow="hidden" width="95%" type="multiple">
          <Accordion.Item value="a1">
            <Accordion.Trigger
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              gap="$2"
              borderRadius="$5"
              borderBottomLeftRadius={0}
              borderBottomRightRadius={0}
            >
              {({ open }: { open: boolean }) => (
                <>
                  <Paragraph fontWeight="700">View Full Description</Paragraph>
                  <Square animation="quick" rotate={open ? "180deg" : "0deg"}>
                    <ChevronDown size="$1" />
                  </Square>
                </>
              )}
            </Accordion.Trigger>
            <Accordion.Content
              borderRadius="$5"
              borderTopLeftRadius={0}
              borderTopRightRadius={0}
            >
              <Paragraph>{event.longDescription}</Paragraph>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
        <View height={100} />
      </ScrollView>
    </>
  );
}
