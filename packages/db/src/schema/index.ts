import * as dietRestrictionSchema from "./dietRestriction";
import * as dishSchema from "./dish";
import * as eventSchema from "./event";
import * as menuSchema from "./menu";
import * as menuPeriodSchema from "./menuPeriod";
import * as nutritionInfoSchema from "./nutritionInfo";
import * as pushTokenSchema from "./pushToken";
import * as restaurantSchema from "./restaurant";
import * as stationSchema from "./station";

export const schema = {
  ...dietRestrictionSchema,
  ...dishSchema,
  ...eventSchema,
  ...menuSchema,
  ...menuPeriodSchema,
  ...nutritionInfoSchema,
  ...pushTokenSchema,
  ...restaurantSchema,
  ...stationSchema,
};

export * from "./dietRestriction";
export * from "./dish";
export * from "./event";
export * from "./menu";
export * from "./menuPeriod";
export * from "./nutritionInfo";
export * from "./pushToken";
export * from "./restaurant";
export * from "./station";

