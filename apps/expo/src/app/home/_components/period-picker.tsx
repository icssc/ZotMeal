import { Picker, PickerProps } from "@react-native-picker/picker";

import type { PeriodName } from "@zotmeal/utils";

interface PeriodPickerProps extends PickerProps {
  availablePeriods: PeriodName[];
  period: PeriodName;
  setPeriod: (periodName: PeriodName) => void;
  color: string;
}

export const PeriodPicker = ({
  availablePeriods,
  period,
  setPeriod,
  color,
}: Readonly<PeriodPickerProps>) => (
  <Picker
    style={{
      width: 150,
    }}
    itemStyle={{
      height: 50,
      paddingVertical: 50,
      fontSize: 18,
      color,
    }}
    selectedValue={period}
    onValueChange={setPeriod}
  >
    {/* Create a Picker.Item for each period */}
    {availablePeriods.map((period) => (
      <Picker.Item key={period} label={period} value={period} />
    ))}
  </Picker>
);
