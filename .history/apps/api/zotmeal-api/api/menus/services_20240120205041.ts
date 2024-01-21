import { Menu, MenuParams } from './types';




async function campusDishURLFromParams({ location, date, mealPeriod }: MenuParams): string {
  const locationId = LOCATION_ID[location] ?? "";
  const mealPeriodId = MEAL_PERIOD_TO_ID[mealPeriod] ?? 0;

  const menuUrl = new URL(this.menuUrl);
  menuUrl.searchParams.append("locationId", locationId);

  const dateString = date.toLocaleTimeString("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Format the date string
  menuUrl.searchParams.append("date", dateString);
  menuUrl.searchParams.append("periodId", mealPeriodId.toString());

  return menuUrl.toString();
}


async function fetchMenuCampusDish(params: MenuParams): Promise<Menu> {
  
}

export { fetchMenuCampusDish };
