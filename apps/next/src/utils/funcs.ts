import { HallEnum } from "./types";

const BWINE_ADDY: string = "557+E+Peltason Dr%2C+Irvine%2C+CA%2C+92617";
const ANTEAT_ADDY: string = "4001+Mesa+Rd%2C+Irvine%2C+CA%2C+92617";

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const fruitKeywords = ["strawberry", "strawberries", "banana", "apple", 
  "orange", "grapes", "melon", "berries", "cantaloupe", "pineapple", "peach", 
  "pear"];
const preparedFruitKeywords = ["cubed", "sliced", "diced fruit", "medley"];
const healthyKeywords = ["oats", "chia", "yogurt", "quinoa", "salad", 
  "vegetable", "tofu", "bean", "lentil", "oatmeal", "cream of wheat", "kale",
  "farro"];
const comfortingKeywords = ["soup", "stew", "pasta", "rice bowl", 
  "mashed potatoes", "casserole", "curry", "chicken", "bacon", "sausage", 
  "egg roll", "burger"];
const bakeryKeywords = ["muffin", "croissant", "scone", "bagel", "bread", 
  "fries", "pizza", "cake", "cookie", "pastry"];
const toppingKeywords = ["lettuce", "carrots", "croutons", "spinach", 
  "bell peppers", "cucumbers", "beans", "tomato", "cheese", "onion", "pickle", 
  "olive", "mushroom"]

function enhanceDescription(dish: string, description: string | null | undefined): string {
  if (!description || description.trim() === "") {
    description = dish;
  }

  let lowerDesc = description.toLowerCase();
  const lowerDish = dish.toLowerCase();

  if (fruitKeywords.some(keyword => lowerDesc === keyword || lowerDesc === keyword + 's')) {
    return `Fresh and simple ${lowerDesc}. A light and healthy choice.`;
  }

  if (preparedFruitKeywords.some(keyword => lowerDesc.includes(keyword)) && fruitKeywords.some(keyword => lowerDesc.includes(keyword))) {
    return `Refreshing ${lowerDesc}. Perfect for a quick energy boost.`;
  }

  if (bakeryKeywords.some(keyword => lowerDish.includes(keyword))) {
    let addPrefix: boolean = !lowerDesc.includes("freshly baked");
    if (addPrefix) lowerDesc = "Freshly prepared " + lowerDesc;
    else lowerDesc = lowerDesc[0].toUpperCase() + lowerDesc.slice(1);

    return `${lowerDesc}. A perfect treat.`;
  }

  if (comfortingKeywords.some(keyword => lowerDish.includes(keyword))) {
    return `Warm and comforting ${lowerDesc}. A satisfying classic.`;
  }

  if (healthyKeywords.some(keyword => lowerDish.includes(keyword))) {
    return `A nutritious choice: ${lowerDesc}. Packed with wholesome ingredients.`;
  }

  if (toppingKeywords.some(keyword => lowerDish.includes(keyword))) {
    return `Enjoy ${lowerDesc} as a tasty topping or by itself.`
  }

  if (description.length < 40) {
    return `Enjoy this classic dish: ${lowerDesc}.`;
  }

  // Return original if no rules match or it's already reasonably descriptive
  return description.endsWith('.') ? description : (description + '.');
}

const numToMonth : {[num: number]: string} = {
  0:  "Jan.",
  1:  "Feb.",
  2:  "Mar.",
  3:  "Apr.",
  4:  "May",
  5:  "Jun.",
  6:  "Jul.",
  7:  "Aug.",
  8:  "Sep.",
  9:  "Oct.",
  10: "Nov.",
  11: "Dec."
};

function getDayWithSuffix(day: number): string {
  if (day > 3 && day < 21) return `${day}th`; // for 4th to 20th
  switch (day % 10) {
    case 1:  return `${day}st`;
    case 2:  return `${day}nd`;
    case 3:  return `${day}rd`;
    default: return `${day}th`;
  }
}

function dateToString(startDate: Date, endDate: Date): string {
  const dayWithSuffix = getDayWithSuffix(startDate.getDate());
  return `${numToMonth[startDate.getMonth()]} ${dayWithSuffix}, ${timeToString(startDate)}-${timeToString(endDate)}`;
}

function padMinutes(minutes: number): string {
  let str: string = minutes+"";
  while (str.length < 2)
    str = "0" + str
  return str;
}

function timeToString(date: Date): string {
  let hours: number = date.getHours();
  let isAfterNoon: boolean = hours > 12;

  return `${isAfterNoon ? hours - 12 : hours}:${padMinutes(date.getMinutes())}${isAfterNoon ? "pm" : "am"}`
}

function generateGCalLink(title: string, desc: string, location: HallEnum, time: Date): string {
  let date: string = `${time.getFullYear()}${(time.getUTCMonth() + 1).toString().padStart(2, '0')}${time.getUTCDate().toString().padStart(2, '0')}T${time.getUTCHours().toString().padStart(2, '0')}${time.getUTCMinutes().toString().padStart(2, '0')}${time.getUTCSeconds().toString().padStart(2, '0')}Z`;

  
  let link: string = `https://www.google.com/calendar/render?action=TEMPLATE` +
  `&text=${location == HallEnum.ANTEATERY ? "Anteatery" : "Brandywine"}:+${title.replace(/\s+/g, "+")}` +
  `&details=${desc.replace(/\s+/g, "+")}` +
  `&location=${location == HallEnum.ANTEATERY ? ANTEAT_ADDY : BWINE_ADDY}` +
  `&dates=${date}/${date}`;

  return link;
}

function utcToPacificTime(utcTimeString: string): Date {
  const [hours, minutes, seconds] = utcTimeString.split(':').map(Number);
  const utcDate = new Date()
  utcDate.setUTCHours(hours);
  utcDate.setUTCMinutes(minutes);
  utcDate.setUTCSeconds(seconds);
  utcDate.setMilliseconds(0);

  const pacificDate = new Date(utcDate.toLocaleString('en-US', { timeZone: 'America/Los_Angeles'}))

  return pacificDate
}

function formatOpenCloseTime(openTime: Date, closeTime: Date): string {
  let openTimeIsAfternoon: boolean = openTime.getHours() > 12;
  let closeTimeIsAfternoon: boolean = closeTime.getHours() > 12;

  let openTimeHours: number = openTimeIsAfternoon ? openTime.getHours() - 12 : openTime.getHours();
  let closeTimeHours: number = closeTimeIsAfternoon ? closeTime.getHours() - 12 : closeTime.getHours();
  let openTimeMinutes: string = padMinutes(openTime.getMinutes())
  let closeTimeMinutes: string = padMinutes(closeTime.getMinutes())

  return `${openTimeHours}:${openTimeMinutes}${openTimeIsAfternoon ? 'p' : 'a'}-${closeTimeHours}:${closeTimeMinutes}${closeTimeIsAfternoon ? 'p' : 'a'}`
}

export { toTitleCase, 
         dateToString, 
         generateGCalLink, 
         timeToString, 
         enhanceDescription,
         utcToPacificTime,
         formatOpenCloseTime}