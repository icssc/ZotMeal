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
  XStack,
  YStack,
} from "tamagui";

import type { Event } from "@zotmeal/db";

import useZotmealStore from "~/utils/useZotmealStore";

export default function Event() {
  const { title } = useGlobalSearchParams();

  if (!title || typeof title !== "string")
    throw new Error("title is not a string");

  const { selectedRestaurant, anteateryEvents, brandywineEvents } =
    useZotmealStore();

  const events =
    selectedRestaurant === "anteatery" ? anteateryEvents : brandywineEvents;

  const event = events.find((event) => event.title === title);

  // TODO: Log error if event is not found
  if (!event) return <Redirect href="/events/" />;

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: event.title,
        }}
      />
      <ScrollView
        height="100%"
        width="100%"
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
        contentInset={{
          bottom: 100,
        }}
      >
        <YStack
          justifyContent="center"
          width="90%"
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
              {selectedRestaurant.charAt(0).toUpperCase() +
                selectedRestaurant.slice(1)}
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
      </ScrollView>
    </>
  );
}
