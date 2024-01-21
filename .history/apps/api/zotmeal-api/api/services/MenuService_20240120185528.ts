import { MEAL_PERIOD_TO_ID, LOCATION_ID, NUTRITION_PROPERTIES } from '../utils';
// import type { ItemInfo, MenuInfo, Nutrition, StationInfo } from '../../../../packages/shared/lib/zotmeal.types';
import type { DataSnapshot, Database } from 'firebase-admin/database';

import axios, { AxiosError } from 'axios';
import { db } from '../firebase.js';
import promiseRetry from 'promise-retry';

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

interface Menu {
    timestamp: Date;
    stationItems: StationInfo[];
}

const STALENESS_THRESHOLD_SECONDS = 600; // 1 week

class MenuService {
  
    constructor(private menuUrl: string, private db: Database) {}

    public async getMenu({ location, date, mealPeriod }: MenuQuery): Promise<Menu> {
        if (!this.isValidMealPeriod(mealPeriod)) {
            throw new InvalidMealError('invalid meal period');
        }

        if (!this.isValidMealPeriod(mealPeriod)) {
            throw new InvalidMealError('invalid meal location');
        }

        const cachedMenu = await this.getMenuFromDB({ location, date, mealPeriod });

        if (cachedMenu && !this.isStale(date, new Date())) {
        } else {
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

        return { timestamp: new Date(), stationItems };
    }

    private async updateDBMenu({ location, date, mealPeriod }: MenuQuery): Promise<void> {
        const menuPath = `menus/${location}/${date}/${mealPeriod}`;

        await this.db.ref(menuPath).push();
    }

    private async getMenuFromDB({ location, date, mealPeriod }: MenuQuery): Promise<StationInfo[]> {
        const dateKey = `${date.getMonth()}|${date.getDay()}|${date.getFullYear()}`;

        const menuPath = `menus/${location}/${dateKey}/${mealPeriod}`;

        const ref = db.ref(menuPath);
        const data = await ref.once('value', (snapshot: DataSnapshot) => snapshot.val());

        const stationInfos: any = data.toJSON();

        console.log(`got menu data for ${location} on ${date.toString()} for ${mealPeriod}`);
        return stationInfos;
    }

    public async getMenuFromCampusDish({ location, date, mealPeriod }: MenuQuery): Promise<StationInfo[]> {
        console.log(location, date, mealPeriod);
        const menuUrl = this.getCampusDishMenuUrl({ location, date, mealPeriod });
        console.log(menuUrl.toString());

        // @TODO add retry, exponential backoff + jitter, timeout
        let response;
        try {
            response = await axios.get(menuUrl.toString());
        } catch (e) {
            console.error('error fetching menu from campus dish');
            throw e;
        }

        console.log('campus dish responded with code', response.status);

        // transform the data
        // stations = {stationId: stationName}
        const stationMenu: any = {};
        const stations: Record<string, string> = {};
        for (let station of response.data.Menu.MenuStations) {
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

        return stationMenus;
    }

    private isStale(date: Date, currentTime: Date): boolean {
        const timeSinceFetched = currentTime.getTime() - date.getTime();
        return timeSinceFetched > 1000 * STALENESS_THRESHOLD_SECONDS;
    }

    getCampusDishMenuUrl({ location, date, mealPeriod }: MenuQuery): string {
        // https://uci.campusdish.com/api/menu/GetMenus?locationId=3056&date=01/14/2022&periodId=49

        if (!this.isValidMealPeriod(mealPeriod)) {
            throw new InvalidMealError('invalid meal period');
        }

        if (!this.isValidLocation(mealPeriod)) {
            throw new InvalidMealError('invalid meal location');
        }

        const locationId = LOCATION_ID[location] ?? '';
        const mealPeriodId = MEAL_PERIOD_TO_ID[mealPeriod] ?? 0;

        const menuUrl = new URL(this.menuUrl);
        menuUrl.searchParams.append('locationId', locationId);

        const dateString = date.toLocaleTimeString('en-US', {
            timeZone: 'America/Los_Angeles',
            hour: '2-digit',
            minute: '2-digit',
        });

        // Format the date string
        menuUrl.searchParams.append('date', dateString);
        menuUrl.searchParams.append('periodId', mealPeriodId.toString());

        return menuUrl.toString();
    }

    private isValidMealPeriod(mealPeriod: string) {
        return MEAL_PERIOD_TO_ID[mealPeriod] !== undefined;
    }

    private isValidLocation(location: string) {
        return LOCATION_ID[location] !== undefined;
    }
}

// Singleton

export default new MenuService('https://uci.campusdish.com/api/menu/GetMenus', db);
