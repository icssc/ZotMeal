import { PrismaClient } from "@zotmeal/db";

export function updateRestaurant(db: PrismaClient) {
  // validate with zod
  const _ = db.restaurant.findFirst();
}

export function createRestaurant(db: PrismaClient) {

  // validate with zod

  const _ = db.restaurant.findFirst();

}

export function getRestaurant(db: PrismaClient) {
  // validate with zod
  const _ = db.restaurant.findFirst();
}
