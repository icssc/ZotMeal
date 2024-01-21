import { Menu } from './types';

public async getMenu({ location, date, mealPeriod }: MenuParams): Promise<Menu> {
  if (!this.isValidMealPeriod(mealPeriod)) {
    throw new InvalidMealError('invalid meal period');
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

export { fetchMenuCampusDish };
