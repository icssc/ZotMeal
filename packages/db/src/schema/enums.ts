import { pgEnum } from "drizzle-orm/pg-core";

import { periodNames, restaurantIds, restaurantNames } from "@zotmeal/utils";

export const restaurantIdEnum = pgEnum("restaurant_id_enum", restaurantIds);
export const restaurantNameEnum = pgEnum("restaurant_name", restaurantNames);
export const periodNameEnum = pgEnum("period_name", periodNames);
