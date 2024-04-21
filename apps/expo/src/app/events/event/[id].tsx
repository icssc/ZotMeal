import React from "react";
import { Stack, useGlobalSearchParams } from "expo-router";
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
import { getRestaurantNameById } from "@zotmeal/utils";

export default function Event() {
  const { id } = useGlobalSearchParams();

  const testData = {
    title: "Test Event",
    start: new Date("2022-01-01 12:00:00"),
    end: new Date(),
    image:
      "https://uci.campusdish.com/-/media/Feature/Articles/DefaultEventImage.ashx?mh=350&mw=350&hash=B788068F09F0E38D1D19756934E293E4C1379BBF",
    shortDescription: "This is a test event with a short description!",
    longDescription: `This is a long description of the event. It's so long that it wraps around multiple lines. It's a very long description, but it's also very interesting. You should definitely read it.`,
    restaurantId: "3314",
  } satisfies Event;

  const restaurantName = getRestaurantNameById(testData.restaurantId);

  if (!restaurantName) {
    throw new Error("Restaurant not found");
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: testData.title,
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
              uri: testData.image ?? require("../example-event-image.png"),
            }}
            minWidth={100}
            maxWidth="100%"
            height={200}
          />
        </YStack>
        <YStack padding={0} gap="$2" marginVertical="$4">
          <H3>{testData.title}</H3>
          <Separator marginBottom="$2" />
          <XStack alignItems="center" padding={0} gap="$2">
            <MapPin />
            <Text fontWeight="700">
              {restaurantName.charAt(0).toUpperCase() + restaurantName.slice(1)}
            </Text>
          </XStack>
          <XStack alignItems="center" padding={0} gap="$2">
            <CalendarClock />
            <Text>
              {format(testData.start.toString(), "LLL do p")} -{" "}
              {format(testData.end.toString(), "LLL do p")}
            </Text>
          </XStack>
          <XStack alignItems="center" padding={0} gap="$2">
            <Info />
            <Text>{testData.shortDescription}</Text>
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
              <Paragraph>{testData.longDescription}</Paragraph>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </ScrollView>
    </>
  );
}
