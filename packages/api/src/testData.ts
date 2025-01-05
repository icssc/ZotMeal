import { addDays, format } from "date-fns";

import type {
  DishToMenu,
  DishWithRelations,
  Event,
  Menu,
  Period,
  Rating,
  Restaurant,
  Station,
  User,
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
} as const satisfies Restaurant;

const anteatery = {
  id: anteateryId,
  name: "anteatery",
} as const satisfies Restaurant;

const station = {
  id: stationId,
  restaurantId: brandywineId,
  name: "grill",
} as const satisfies Station;

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
} as const satisfies DishWithRelations;

const menu = {
  id: menuId,
  restaurantId: brandywineId,
  date: format(new Date(), "yyyy-MM-dd"),
  periodId,
  price: "13",
} as const satisfies Menu;

const period = {
  id: periodId,
  name: "breakfast",
  startTime: "08:00:00",
  endTime: "10:00:00",
} as const satisfies Period;

const dishToMenu = {
  dishId,
  menuId,
} as const satisfies DishToMenu;

const user = {
  id: userId,
  name: "Peter",
} as const satisfies User;

const rating = {
  dishId,
  userId,
  rating: 1,
} as const satisfies Rating;

const event = {
  title: "Dinner",
  start: new Date(),
  end: new Date(addDays(new Date(), 1)),
  restaurantId: brandywineId,
  image: "https://example.com/image.jpg",
  shortDescription: "Enjoy our cream puffs",
  longDescription:
    "For this week, we're hosting a special event. We're going to be serving cream puffs. Come and join us for a fun and festive evening!",
} as const satisfies Event;

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
