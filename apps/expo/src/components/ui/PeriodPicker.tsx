import type { PickerProps } from "@react-native-picker/picker";
import { Picker } from "@react-native-picker/picker";

interface PeriodPickerProps extends PickerProps {
  periods: string[];
  period: string | null;
  setPeriod: (period: string) => void;
  color: string;
}

export const PeriodPicker = ({
  periods,
  period,
  setPeriod,
  color,
}: Readonly<PeriodPickerProps>) => (
  <Picker
    style={{ width: 150 }}
    itemStyle={{
      height: 50,
      paddingVertical: 50,
      fontSize: 18,
      color,
    }}
    selectedValue={period ?? undefined}
    onValueChange={setPeriod}
  >
    {periods.map((period) => (
      <Picker.Item key={period} label={period} value={period} />
    ))}
  </Picker>
);
