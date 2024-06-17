import React from "react";
import { endOfWeek, startOfWeek } from "date-fns";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import type { ButtonProps, TamaguiElement } from "tamagui";
import { CalendarDays } from "@tamagui/lucide-icons";
import { Button } from "tamagui";

interface UniversalDatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

/**
 * react-datepicker expects web props 'value' and 'onClick' to be passed to the
 * custom input component, but since we're using react native, we need to pass
 * onPress instead.
 */
interface CustomInputProps {
  value: HTMLInputElement["value"];
  onClick: ButtonProps["onPress"];
}

/**
 * Courtesy of issue thread:
 * @see https://github.com/Hacker0x01/react-datepicker/issues/2165#issuecomment-711032947
 */
const CustomInput = (
  { value, onClick }: CustomInputProps,
  ref: React.Ref<TamaguiElement>,
) => (
  <Button icon={CalendarDays} onPress={onClick} ref={ref}>
    {value}
  </Button>
);

/**
 * Universal date picker for web.
 */
export const UniversalDatePicker = ({
  date,
  setDate,
}: Readonly<UniversalDatePickerProps>) => {
  return (
    <DatePicker
      customInput={React.createElement(React.forwardRef(CustomInput))}
      selected={date}
      minDate={startOfWeek(new Date())}
      maxDate={endOfWeek(new Date())}
      onChange={(prev) => setDate(prev ?? new Date())}
    />
  );
};
