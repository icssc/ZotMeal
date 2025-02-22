import { addDays, format } from "date-fns";

import type {
  DishToMenu,
  InputUser,
  InsertDishWithRelations,
  InsertEvent,
  InsertMenu,
  InsertPeriod,
  InsertRating,
  InsertRestaurant,
  InsertStation,
} from "@zotmeal/db";
import { restaurantIds } from "@zotmeal/db";

const brandywineId = restaurantIds[0];
const anteateryId = restaurantIds[1];
const dishId = "dish1";
const menuId = "menu1";
const stationId = "station1";
const userId = "user1";
const periodId = "period1";

const brandywine = {
  id: brandywineId,
  name: "brandywine",
} as const satisfies InsertRestaurant;

const anteatery = {
  id: anteateryId,
  name: "anteatery",
} as const satisfies InsertRestaurant;

const station = {
  id: stationId,
  restaurantId: brandywineId,
  name: "grill",
} as const satisfies InsertStation;

const dish = {
  id: dishId,
  name: "Grilled Salmon with Quinoa",
  description:
    "A heart-healthy dish featuring omega-3 rich salmon, served over a bed of fluffy quinoa with a side of steamed asparagus.",
  category: "Main Course",
  stationId,
  dietRestriction: {
    dishId,
    containsEggs: false,
    containsFish: true,
    containsMilk: false,
    containsPeanuts: false,
    containsSesame: false,
    containsShellfish: false,
    containsSoy: false,
    containsTreeNuts: false,
    containsWheat: false,
    isGlutenFree: true,
    isHalal: true,
    isKosher: false,
    isLocallyGrown: true,
    isOrganic: true,
    isVegan: false,
    isVegetarian: false,
  },
  nutritionInfo: {
    dishId,
    servingSize: "350",
    servingUnit: "grams",
    calories: "560",
    totalFatG: "21g",
    transFatG: "0g",
    saturatedFatG: "4g",
    cholesterolMg: "125mg",
    sodiumMg: "650mg",
    totalCarbsG: "45g",
    dietaryFiberG: "6g",
    sugarsMg: "5g",
    proteinG: "45g",
    vitaminAIU: "25%",
    vitaminCIU: "30%",
    calciumMg: "4%",
    ironMg: "15%",
  },
} as const satisfies InsertDishWithRelations;

const menu = {
  id: menuId,
  restaurantId: brandywineId,
  date: format(new Date(), "yyyy-MM-dd"),
  periodId,
  price: "13",
} as const satisfies InsertMenu;

const period = {
  id: periodId,
  name: "breakfast",
  startTime: "08:00:00",
  endTime: "10:00:00",
} as const satisfies InsertPeriod;

const dishToMenu = {
  dishId,
  menuId,
} as const satisfies DishToMenu;

const user = {
  id: userId,
  name: "Peter",
} as const satisfies InputUser;

const rating = {
  dishId,
  userId,
  rating: 1,
} as const satisfies InsertRating;

const event = {
  title: "Dinner",
  start: new Date(),
  end: new Date(addDays(new Date(), 1)),
  restaurantId: brandywineId,
  image: "https://example.com/image.jpg",
  shortDescription: "Enjoy our cream puffs",
  longDescription:
    "For this week, we're hosting a special event. We're going to be serving cream puffs. Come and join us for a fun and festive evening!",
} as const satisfies InsertEvent;

export const testData = {
  brandywine,
  anteatery,
  station,
  dish,
  menu,
  period,
  dishToMenu,
  user,
  rating,
  event,
} as const;
