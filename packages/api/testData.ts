import { addDays, format } from "date-fns";

import type {
  DishMenuStationJoint,
  DishWithRelations,
  Event,
  Menu,
  Rating,
  Restaurant,
  Station,
  User,
} from "@zotmeal/db";

const restaurantId = "3056";
const dishId = "dish1";
const menuId = "menu1";
const stationId = "station1";
const userId = "user1";

const restaurant = {
  id: restaurantId,
  name: "brandywine",
} as const satisfies Restaurant;

const station = {
  id: stationId,
  restaurantId,
  name: "grill",
} as const satisfies Station;

const dish = {
  id: dishId,
  name: "Grilled Salmon with Quinoa",
  description:
    "A heart-healthy dish featuring omega-3 rich salmon, served over a bed of fluffy quinoa with a side of steamed asparagus.",
  category: "Main Course",
  menuId,
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
    caloriesFromFat: "190",
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
  restaurantId,
  date: format(new Date(), "yyyy-MM-dd"),
  period: "lunch",
  start: new Date(),
  end: new Date(addDays(new Date(), 1)),
  price: "13",
} as const satisfies Menu;

const joint = {
  dishId,
  menuId,
  stationId,
} as const satisfies DishMenuStationJoint;

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
  restaurantId,
  image: "https://example.com/image.jpg",
  shortDescription: "Enjoy our cream puffs",
  longDescription:
    "For this week, we're hosting a special event. We're going to be serving cream puffs. Come and join us for a fun and festive evening!",
} as const satisfies Event;

export const testData = {
  restaurant,
  station,
  dish,
  menu,
  joint,
  user,
  rating,
  event,
} as const;
