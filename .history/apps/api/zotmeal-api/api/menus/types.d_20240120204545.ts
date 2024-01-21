export interface Menu {
  timestamp: Date;
  stationItems: StationInfo[];
}

export interface MenuParams {
  location: string;
  date: Date;
  mealPeriod: string;
}