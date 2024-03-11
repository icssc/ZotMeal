import { db } from "@zotmeal/drizzle-db";
import { menu } from "@zotmeal/drizzle-db/src/schema";
import { eq } from 'drizzle-orm';

const brandywineMenu = await db.query.menu.findFirst({
  with: {
    stations: {
      with: {
        dishes: {
          with: {
            nutritionInfo: true,
          },
        }
      },
    }
  },
  where: eq(menu.restaurantId, "3314"),
});

export type Menu = NonNullable<typeof brandywineMenu>;
export type Station = Menu["stations"][0];
export type Dish = Station["dishes"][0];
