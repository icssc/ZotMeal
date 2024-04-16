import * as dietRestrictionSchema from "./diet-restriction-table";
import * as dishMenuStationJointSchema from "./dish-menu-station-joint";
import * as dishSchema from "./dish-table";
import * as eventSchema from "./event-table";
import * as menuSchema from "./menu-table";
import * as nutritionInfoSchema from "./nutrition-info-table";
import * as pushTokenSchema from "./push-token-table";
import * as restaurantSchema from "./restaurant-table";
import * as stationSchema from "./station-table";

export const schema = {
  ...dietRestrictionSchema,
  ...dishSchema,
  ...eventSchema,
  ...menuSchema,
  ...nutritionInfoSchema,
  ...pushTokenSchema,
  ...restaurantSchema,
  ...stationSchema,
  ...dishMenuStationJointSchema,
};

export * from "./diet-restriction-table";
export * from "./dish-table";
export * from "./event-table";
export * from "./menu-table";
export * from "./nutrition-info-table";
export * from "./push-token-table";
export * from "./restaurant-table";
export * from "./station-table";
export * from "./dish-menu-station-joint";
