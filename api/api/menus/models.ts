import { StationInfo } from '../../../packages/lib/zotmeal';
import { z } from 'zod';

interface Menu {
  date: string;
  location: DiningLocation;
  timestamp: Date;
  meal: MealPeriod;
  stationItems: StationInfo[];
}

enum DiningLocation {
  brandywine = 'brandywine',
  anteatery = 'anteatery',
}

enum MealPeriod {
  breakfast = 'breakfast',
  lunch = 'lunch',
  dinner = 'dinner',
  brunch = 'brunch',
}

const MenuParamsSchema = z.object({
  location: z.nativeEnum(DiningLocation),
  date: z.string().regex(RegExp('\\d{2}/\\d{2}/\\d{4}')),
  meal: z.nativeEnum(MealPeriod),
});

type MenuParams = z.infer<typeof MenuParamsSchema>;

const DiningLocationToID: Record<DiningLocation, string> = {
  [DiningLocation.brandywine]: '3314',
  [DiningLocation.anteatery]: '1234',
};

const MealPeriodToID: Record<MealPeriod, string> = {
  [MealPeriod.breakfast]: '49',
  [MealPeriod.lunch]: '106',
  [MealPeriod.dinner]: '107',
  [MealPeriod.brunch]: '2651',
};

export { Menu, DiningLocation, MealPeriod, MenuParamsSchema, MenuParams, DiningLocationToID, MealPeriodToID };
