import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";

// import { restaurantIds, restaurantNames } from "@zotmeal/utils";

export const createdAt = timestamp("created_at", {
  mode: "string",
  precision: 3,
})
  .defaultNow()
  .notNull();

export const updatedAt = timestamp("updated_at", {
  mode: "string",
}).default(sql`CURRENT_TIMESTAMP(3)`);

// export const restaurantIdEnum = pgEnum("restaurant_id_enum", restaurantIds);
// export const restaurantNameEnum = pgEnum("restaurant_name", restaurantNames);

export const metadataColumns = { createdAt, updatedAt };
