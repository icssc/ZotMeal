import { StationInfo } from "../../shared/lib/zotmeal.types";
import { MEAL_PERIOD_TO_ID, LOCATION_ID, NUTRITION_PROPERTIES } from "../util";
const { StationInfo } = require("../../shared/lib/zotmeal.types");
const axios = require("axios");
const db = require("../db.ts");

// Contains services for fetching and retrieving menu data

class InvalidMealError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
  }
}

interface MenuQuery {
  location: string;
  date: Date;
  mealPeriod: string;
}

const STALENESS_THRESHOLD_SECONDS = 600; // 1 week

class MenuService {
  constructor(private menuUrl: string, private db) {}

  public async getMenu({
    location,
    date,
    mealPeriod,
  }: MenuQuery): Promise<StationInfo[]> {
    if (!this.isValidMealPeriod(mealPeriod)) {
      throw new InvalidMealError("invalid meal period");
    }

    // const menuFromDB = await this.getMenuFromDB({
    //   location,
    //   date,
    //   mealPeriod,
    // });

    const stationItems = await this.getMenuFromCampusDish({
      location,
      date,
      mealPeriod,
    });

    return stationItems;
  }

  private async updateDBMenu({
    location,
    date,
    mealPeriod,
  }: MenuQuery): Promise<StationInfo[]> {
    return [];
  }

  private async getMenuFromDB({
    location,
    date,
    mealPeriod,
  }: MenuQuery): Promise<StationInfo[]> {
    const dateKey = `${date.getMonth()}|${date.getDay()}|${date.getFullYear()}`;

    const menuPath = `menus/${location}/${dateKey}/${mealPeriod}`;

    const ref = db.ref(menuPath);
    const data = await ref.once("value", (snapshot) => snapshot.value());

    console.log(
      `got menu data for ${location} on ${date.toString()} for ${mealPeriod}`,
    );
    return data;
  }

  public async getMenuFromCampusDish({
    location,
    date,
    mealPeriod,
  }: MenuQuery): Promise<StationInfo[]> {
    console.log(location, date, mealPeriod);
    const menuUrl = this.getCampusDishMenuUrl({ location, date, mealPeriod });
    console.log(menuUrl.toString());

    // @TODO add retry, exponential backoff, timeout

    let response; // should be typed

    try {
      response = await axios.get(menuUrl.toString());
    } catch (e) {
      console.log("error fetching menu from campus dish");
      throw e;
    }

    console.log("campus dish responded with code", response.status);

    // transform the data
    // stations = {stationId: stationName}
    const stations = {};
    // stationMenu = {station:stationName, menu:[menuItems]]}
    const stationMenu = {};
    for (const station of response.data.Menu.MenuStations) {
      stations[station.StationId] = station.Name;
      stationMenu[station.Name] = {};
    }

    for (const product of response.data.Menu.MenuProducts) {
      const detail = product.Product;

      const stationName = stations[product.StationId];
      const productName = detail.MarketingName;
      const categoryName = detail.Categories[0].DisplayName;
      const description = detail.ShortDescription;

      // nutrition = {nutritionProperty: value}
      const nutrition = {
        isEatWell: false,
        isPlantForward: false,
        isWholeGrain: false,
      };
      for (const property of NUTRITION_PROPERTIES) {
        nutrition[property] = detail[property];
      }

      for (const icon of detail.DietaryInformation) {
        if (icon.Name == "Plant Forward") {
          nutrition["isPlantForward"] = true;
        } else if (icon.Name == "Eat Well") {
          nutrition["isEatWell"] = true;
        } else if (icon.Name == "Made With Whole Grains") {
          nutrition["isWholeGrain"] = true;
        }
      }

      const menuItem = {
        name: productName,
        description: description,
        nutrition: nutrition,
      };
      if (!(categoryName in stationMenu[stationName])) {
        stationMenu[stationName][categoryName] = [];
      }
      stationMenu[stationName][categoryName].push(menuItem);
    }

    //Turn all data into the format of [stationMenu]
    const stationMenus = [];

    for (const stationName in stationMenu) {
      const category_item_list = [];
      for (const category in stationMenu[stationName]) {
        category_item_list.push({
          category: category,
          items: stationMenu[stationName][category],
        });
      }
      stationMenus.push({
        station: stationName,
        menu: category_item_list,
      });
    }

    return stationMenus;
  }

  private isStale(date: Date, currentTime: Date): boolean {
    const timeSinceFetched = currentTime.getTime() - date.getTime();
    return timeSinceFetched > 1000 * STALENESS_THRESHOLD_SECONDS;
  }

  private getCampusDishMenuUrl({
    location,
    date,
    mealPeriod,
  }: MenuQuery): string {
    // https://uci.campusdish.com/api/menu/GetMenus?locationId=3056&date=01/14/2022&periodId=49

    if (!this.isValidMealPeriod(mealPeriod)) {
      throw new InvalidMealError("invalid meal period");
    }

    const locationId = LOCATION_ID[location];
    const mealPeriodId = MEAL_PERIOD_TO_ID[mealPeriod];

    const menuUrl = new URL(this.menuUrl);
    menuUrl.searchParams.append("locationId", locationId);

    const dateString = date.toLocaleTimeString("en-US", {
      timeZone: "America/Los_Angeles",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Format the date string
    menuUrl.searchParams.append("date", dateString);
    menuUrl.searchParams.append("periodId", mealPeriodId);

    return menuUrl.toString();
  }

  private isValidMealPeriod(mealPeriod: string) {
    return MEAL_PERIOD_TO_ID[mealPeriod] !== undefined;
  }
}

// daily fetch cron service

// service
// get a menu for a date

// Singleton

module.exports = new MenuService(
  "https://uci.campusdish.com/api/menu/GetMenus",
  db,
);
