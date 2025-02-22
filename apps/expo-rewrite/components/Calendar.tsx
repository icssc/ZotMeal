import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import DateTimePicker, { getDefaultStyles } from "react-native-ui-datepicker";
import { endOfWeek, startOfWeek } from "date-fns";

import { formatDate } from "../utils/date";
import { ThemedText } from "./ThemedText";

export function Calendar({
  date,
  setDate,
}: {
  date: Date;
  setDate: (date: Date) => void;
}) {
  const defaultStyles = getDefaultStyles();

  const open = useSharedValue(false);

  const springConfig = {
    duration: 750,
    dampingRatio: 1.2,
    stiffness: 109,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 2,
    reduceMotion: ReduceMotion.System,
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withSpring(open.value ? 1 : 0, {
        ...springConfig,
        duration: 100,
      }),
      height: withSpring(open.value ? 300 : 0, springConfig),
      marginBottom: withSpring(open.value ? 0 : -50, springConfig),
    };
  });

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          open.value = !open.value;
        }}
        style={{
          margin: "auto",
          paddingHorizontal: 10,
          paddingVertical: 3,
          borderRadius: 25,
          backgroundColor: "#309CFF",
          transform: [{ translateY: -33 }],
        }}
      >
        <ThemedText style={{ fontWeight: 600 }}>{formatDate(date)}</ThemedText>
      </TouchableOpacity>
      <Animated.View
        style={[
          {
            transform: [{ translateY: -33 }],
          },
          animatedStyles,
        ]}
      >
        <DateTimePicker
          mode="single"
          disableYearPicker
          date={date}
          timePicker={false}
          minDate={startOfWeek(new Date())}
          maxDate={endOfWeek(new Date())}
          onChange={({ date }) => {
            setDate(new Date(date as Date));
          }}
          styles={{
            ...defaultStyles,
            month_selector_label: {
              ...defaultStyles.month_selector_label,
              fontFamily: "Default",
            },
            year_selector_label: {
              ...defaultStyles.year_selector_label,
              fontFamily: "Default",
            },
            weekday_label: {
              ...defaultStyles.weekday_label,
              fontFamily: "Default",
            },
            day_label: {
              ...defaultStyles.day_label,
              fontFamily: "Default",
            },
            button_prev: {
              ...defaultStyles.button_prev,
              fontFamily: "Default",
            },
            button_next: {
              ...defaultStyles.button_next,
              fontFamily: "Default",
            },
          }}
        />
      </Animated.View>
    </>
  );
}
