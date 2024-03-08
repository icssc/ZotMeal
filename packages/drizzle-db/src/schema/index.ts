import * as dietRestrictionSchema from "./dietRestriction";
import * as dishSchema from "./dish";
import * as eventSchema from "./event";
import * as menuSchema from "./menu";
import * as nutritionInfoSchema from "./nutritionInfo";
import * as pushTokenSchema from "./pushToken";
import * as restaurantSchema from "./restaurant";
import * as stationSchema from "./station";

export const schema = {
  ...dietRestrictionSchema,
  ...nutritionInfoSchema,
  ...dishSchema,
  ...eventSchema,
  ...menuSchema,
  ...restaurantSchema,
  ...stationSchema,
  ...pushTokenSchema,
};

export * from "./dish";
export * from "./event";
export * from "./menu";
export * from "./restaurant";
export * from "./station";
export * from "./pushToken";
