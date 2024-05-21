import { Picker } from "@react-native-picker/picker";

import type { PeriodName } from "@zotmeal/utils";
import { PeriodEnum } from "@zotmeal/utils";

interface PeriodPickerProps {
  periodName: PeriodName;
  setPeriodName: (periodName: PeriodName) => void;
  color: string;
}

export const PeriodPicker = ({
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
    {Object.entries(PeriodEnum).map(([period, id]) => (
      <Picker.Item key={id} label={period} value={period} />
    ))}
  </Picker>
);
