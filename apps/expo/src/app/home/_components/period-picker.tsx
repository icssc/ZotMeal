import { Picker } from "@react-native-picker/picker";

import type { PeriodName } from "@zotmeal/utils";

interface PeriodPickerProps {
  availablePeriods: PeriodName[];
  periodName: PeriodName;
  setPeriodName: (periodName: PeriodName) => void;
  color: string;
}

export const PeriodPicker = ({
  availablePeriods,
  periodName,
  setPeriodName,
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
    selectedValue={periodName}
    onValueChange={(itemValue, _) => {
      setPeriodName(itemValue);
    }}
  >
    {/* Create a Picker.Item for each period */}
    {availablePeriods.map((period) => (
      <Picker.Item key={period} label={period} value={period} />
    ))}
  </Picker>
);
