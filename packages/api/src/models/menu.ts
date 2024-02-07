import type { Prisma } from "@zotmeal/db";

// export interface StationWithDishes extends Station {
//   dishes: Dish[];
// }

export type MenuModel = Prisma.MenuGetPayload<{
  include: {
    stations: {
      include: {
        dishes: true;
      };
    };
    restaurant: true;
  };
}>;
