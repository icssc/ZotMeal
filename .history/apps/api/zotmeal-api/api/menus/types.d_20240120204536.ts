export interface Menu {
  timestamp: Date;
  stationItems: StationInfo[];
}

interface MenuParams {
  location: string;
  date: Date;
  mealPeriod: string;
}