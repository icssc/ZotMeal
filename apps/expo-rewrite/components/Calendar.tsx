import React, { useContext } from "react";
import { Pressable } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import DateTimePicker, { getDefaultStyles } from "react-native-ui-datepicker";
import { endOfWeek, startOfWeek } from "date-fns";

import { defaultSpringConfig } from "../constants/Animation";
import { useThemeColor } from "../hooks/useThemeColor";
import { colorShade } from "../utils/color";
import { formatDate } from "../utils/date";
import { triggerHaptic } from "../utils/haptic";
import { RestaurantContext } from "./RestaurantContext";
import { ThemedText } from "./ThemedText";

export function Calendar({
  date,
  setDate,
}: {
  date: Date;
  setDate: (date: Date) => void;
}) {
  const defaultStyles = getDefaultStyles();
  const activityIndicatorValue = useSharedValue(0);
  const open = useSharedValue(false);
  const isPressed = useSharedValue(false);
  const backgroundColor = useThemeColor({}, "background");
  const { isFetching } = useContext(RestaurantContext)!;

  const datePickerStyles = useAnimatedStyle(() => {
    return {
      opacity: withSpring(open.value ? 1 : 0, {
        ...defaultSpringConfig,
        duration: 100,
      }),
      height: withSpring(open.value ? 300 : 50, defaultSpringConfig),
      marginBottom: withSpring(open.value ? 0 : -50, defaultSpringConfig),
    };
  });

  React.useEffect(() => {
    if (isFetching) {
      activityIndicatorValue.value = withRepeat(
        withTiming(1, { duration: 250 }),
        -1,
        true,
      );
    } else {
      activityIndicatorValue.value = withTiming(0, { duration: 250 });
    }
  }, [isFetching]);

  const darkerAccent = colorShade("#309CFF", -60);

  const activityIndicatorColor = useDerivedValue(() => {
    return interpolateColor(
      activityIndicatorValue.value,
      [0, 1],
      ["#309CFF", darkerAccent],
    );
  });

  const buttonStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: activityIndicatorColor.value,
      transform: [
        {
          scale: withTiming(isPressed.value ? 0.95 : 1, {
            duration: 100,
          }),
        },
        {
          translateY: -15,
        },
      ],
    };
  });
  const borderStyle = useAnimatedStyle(() => {
    return {
      borderColor: activityIndicatorColor.value,
    };
  });

  return (
    <Animated.View
      style={[
        {
          borderWidth: 3,
          width: "102%",
          marginLeft: "-1%",
          backgroundColor,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          marginTop: -10,
        },
        borderStyle,
      ]}
    >
      <Pressable
        onPressIn={() => {
          isPressed.value = true;
        }}
        onPressOut={() => {
          isPressed.value = false;
        }}
        onPress={() => {
          triggerHaptic();
          open.value = !open.value;
        }}
      >
        <Animated.View
          style={[
            {
              margin: "auto",
              paddingHorizontal: 10,
              paddingVertical: 3,
              borderRadius: 25,
            },
            buttonStyle,
          ]}
        >
          <ThemedText style={{ fontWeight: 600 }}>
            {formatDate(date)}
          </ThemedText>
        </Animated.View>
      </Pressable>
      <Animated.View
        style={[{ width: "90%", margin: "auto" }, datePickerStyles]}
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
    </Animated.View>
  );
}
