import type { DiningHallInformation } from "@zotmeal/validators";
import { upsertPeriod } from "@api/periods/services";
import type { Drizzle } from "@zotmeal/db";
import type { MealPeriodWithHours } from "@zotmeal/validators";
import { logger } from "@api/logger";

export async function upsertPeriods(
  db: Drizzle,
  restaurantId: "3056" | "3314",
  dateString: string,
  dayOfWeek: number,
  mealPeriods: MealPeriodWithHours[],
) {
  const periodsResult = await Promise.allSettled(
    mealPeriods.map(period => {
        upsertPeriod(db, {
          id: period.id.toString(),
          date: dateString,
          restaurantId: restaurantId,
          name: period.name,
          startTime: period.openHours[dayOfWeek] ?? "",
          endTime: period.closeHours[dayOfWeek] ?? ""
        })
      }
    )
  );

  for (const period of periodsResult)
    if (period.status === "rejected") {
      const reason = period.reason;
      let periodDetail = "unknown period";
      if (reason && typeof reason === 'object' && 'value' in reason && reason.value && typeof reason.value === 'object' && 'name' in reason.value && typeof reason.value.name === 'string') {
        periodDetail = `period '${reason.value.name}'`;
      } else if (reason instanceof Error) {
        periodDetail = `Error: ${reason.message}`;
      } else {
        periodDetail = `Reason: ${JSON.stringify(reason)}`;
      }
      logger.error(
        `Failed to insert period ${periodDetail} for ${restaurantId}.`,
        reason,
      );
    }

}