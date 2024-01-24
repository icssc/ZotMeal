import axios from 'axios';
import { DiningLocationToID, MealPeriodToID, Menu, MenuParams } from './models';
import { NUTRITION_PROPERTIES } from '../utils';
import { ItemInfo, MenuInfo, Nutrition, StationInfo } from '../../../packages/lib/zotmeal';

const CAMPUS_DISH_URL = 'https://uci-campusdish-com.translate.goog/api/menu/GetMenus';

// async function getMenuCampusDish(params: MenuParams): Menu {}

// async function fetchMenuCampusDish(params: MenuParams): Promise<Menu> {}

async function fetchMenuCampusDish({ location, date, meal }: MenuParams): Promise<Menu> {
  console.log(location, date, meal);
  const url = new URL(CAMPUS_DISH_URL);

  const locationId = DiningLocationToID[location];
  const mealId = MealPeriodToID[meal];
  url.searchParams.append('locationId', locationId);
  url.searchParams.append('date', date);
  url.searchParams.append('periodId', mealId);

  // const menuUrl = getCampusDishMenuUrl({ location, date, meal });
  // console.log(menuUrl.toString());
  const response = await axios.get(url.toString());

  // @TODO add retry, exponential backoff + jitter, timeout
  // let response;
  // try {
  //   response = await axios.get(menuUrl.toString());
  // } catch (e) {
  //   console.error('error fetching menu from campus dish');
  //   throw e;
  // }

  console.log('campus dish responded with code', response.status);

  // transform the data
  // stations = {stationId: stationName}
  const stationMenu: any = {};
  const stations: Record<string, string> = {};
  for (const station of response.data.Menu.MenuStations) {
    const { StationId, Name } = station;
    stations[StationId] = StationId;

    stationMenu[Name] = {};
  }

  for (const product of response.data.Menu.MenuProducts) {
    const detail = product.Product;

    const stationName = stations[product.StationId] ?? '';
    const productName = detail.MarketingName;
    const categoryName = detail.Categories[0].DisplayName;
    const description = detail.ShortDescription;

    // nutrition = {nutritionProperty: value}
    const nutrition: any = {
      isEatWell: false,
      isPlantForward: false,
      isWholeGrain: false,
    };

    for (const property of NUTRITION_PROPERTIES) {
      nutrition[property] = detail[property];
    }

    for (const icon of detail.DietaryInformation) {
      if (icon.Name === 'Plant Forward') {
        nutrition.isPlantForward = true;
      } else if (icon.Name === 'Eat Well') {
        nutrition.isEatWell = true;
      } else if (icon.Name === 'Made With Whole Grains') {
        nutrition.isWholeGrain = true;
      }
    }

    if (!(categoryName in stationMenu[stationName][categoryName])) {
      stationMenu[stationName][categoryName] = [];
    }

    const menuItem: ItemInfo = {
      name: productName,
      description: description,
      nutrition: nutrition as Nutrition,
    };
    stationMenu[stationName][categoryName].push(menuItem);
  }

  //Turn all data into the format of [stationMenu]
  const stationMenus: StationInfo[] = [];

  for (const stationName in stationMenu) {
    const category_item_list: MenuInfo[] = [];
    for (const category in stationMenu[stationName]) {
      category_item_list.push({
        category: category,
        items: stationMenu[stationName]?.[category] ?? [],
      });
    }
    stationMenus.push({
      station: stationName,
      menu: category_item_list,
    });
  }

  const menu = {
    location,
    timestamp: new Date(Date.now()),
    date,
    meal,
    stationItems: stationMenus,
  } as Menu;

  return menu;
}

export { fetchMenuCampusDish };
