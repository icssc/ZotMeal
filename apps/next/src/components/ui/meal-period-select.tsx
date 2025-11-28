import type { Dispatch, SetStateAction } from "react";
import { formatOpenCloseTime, toTitleCase } from "@/utils/funcs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./shadcn/select";

interface SideSelectProps {
  selectedPeriod: string;
  setSelectedPeriod: Dispatch<SetStateAction<string>>;
  periods: string[];
  availablePeriodTimes: { [mealName: string]: [Date, Date] };
}

/**
 * A client component that allows the user to set the selected period.
 */
export default function MealPeriodSelect({
  selectedPeriod,
  setSelectedPeriod,
  periods,
  availablePeriodTimes,
}: SideSelectProps) {
  return (
    <div>
      <Select
        value={selectedPeriod}
        onValueChange={(value) => setSelectedPeriod(value || "")}
      >
        <SelectTrigger className="w-full sm:w-52">
          <SelectValue placeholder="Select Meal" />
        </SelectTrigger>
        <SelectContent>
          {periods.map((time) => {
            const mealTimeKey = time.toLowerCase();
            const periodTimes = availablePeriodTimes[mealTimeKey];

            return (
              <SelectItem key={time} value={mealTimeKey}>
                {toTitleCase(time)}&nbsp;
                {periodTimes && (
                  <span className="text-zinc-500 text-sm">
                    &nbsp;(
                    {formatOpenCloseTime(periodTimes[0], periodTimes[1])})
                  </span>
                )}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
