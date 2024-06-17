import React, { useState } from "react";
import { Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CalendarDays } from "@tamagui/lucide-icons";
import { endOfWeek, startOfWeek } from "date-fns";
import { Button } from "tamagui";

/**
 * Native date picker for iOS and Android.
 *
 * Platform handling from an issue thread:
 *
 * @see https://github.com/react-native-datetimepicker/datetimepicker/issues/54
 */
export const UniversalDatePicker = ({
  date,
  setDate,
}: Readonly<{ date: Date; setDate: (date: Date) => void }>) => {
  const [showDatePicker, setShowDatePicker] = useState<boolean>(
    Platform.OS === "ios",
  );

  return (
    <>
      {Platform.OS === "android" && (
        <Button
          onPress={() => setShowDatePicker(true)}
          icon={CalendarDays}
          scaleIcon={1.5}
          size="$5"
          borderRadius="$10"
          pressTheme
        >
          {date.toLocaleDateString("en-US")}
        </Button>
      )}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          minimumDate={startOfWeek(new Date())}
          maximumDate={endOfWeek(new Date())}
          onChange={(_, selectedDate) => {
            // hide date picker on android
            setShowDatePicker(Platform.OS === "ios");
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}
    </>
  );
};
