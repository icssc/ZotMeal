import type { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./shadcn/select";
import { formatOpenCloseTime, toTitleCase } from "@/utils/funcs";

interface SideSelectProps {
  selectedPeriod: string,
  setSelectedPeriod: Dispatch<SetStateAction<string>>,
  periods: string[],
  availablePeriodTimes: { [mealName: string]: [Date, Date] },
};

export default function SideSelect({
  selectedPeriod,
  setSelectedPeriod,
  periods,
  availablePeriodTimes
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
                    {formatOpenCloseTime(
                      periodTimes[0],
                      periodTimes[1],
                    )}
                    )
                  </span>
                )}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  )
}