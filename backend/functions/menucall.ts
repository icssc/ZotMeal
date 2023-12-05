import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const menuService = require("../services/MenuService.ts");
const axios = require("axios");
const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
  const location = event.queryStringParameters?.location;
  const mealPeriod = event.queryStringParameters?.meal;
  const dateString = event.queryStringParameters?.date;

  if (!location || !mealPeriod || !dateString) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "must provide 'location', 'meal', and 'date'",
      }),
    };
  }

  // const locationId = LOCATION_ID[location];
  // const mealId = MEAL_PERIOD_TO_ID[meal];

  //  anteatery 01/14/2022 breakfast
  //  https://uci.campusdish.com/api/menu/GetMenus?locationId=3056&date=01/14/2022&periodId=49

  // let apiCallURL = `https://uci.campusdish.com/api/menu/GetMenus?locationId=${locationId}&date=${date}&periodId=${mealId}`;

  try {
    // const response = await axios.get(apiCallURL);

    // // stations = {stationId: stationName}
    // const stations = {};
    // // stationMenu = {station:stationName, menu:[menuItems]]}
    // const stationMenu = {};
    // for (const station of response.data.Menu.MenuStations) {
    //   stations[station.StationId] = station.Name;
    //   stationMenu[station.Name] = {};
    // }

    // for (const product of response.data.Menu.MenuProducts) {
    //   const detail = product.Product;

    //   const stationName = stations[product.StationId];
    //   const productName = detail.MarketingName;
    //   const categoryName = detail.Categories[0].DisplayName;
    //   const description = detail.ShortDescription;

    //   // nutrition = {nutritionProperty: value}
    //   const nutrition = {
    //     isEatWell: false,
    //     isPlantForward: false,
    //     isWholeGrain: false,
    //   };
    //   for (const property of NUTRITION_PROPERTIES) {
    //     nutrition[property] = detail[property];
    //   }

    //   for (const icon of detail.DietaryInformation) {
    //     if (icon.Name == "Plant Forward") {
    //       nutrition["isPlantForward"] = true;
    //     } else if (icon.Name == "Eat Well") {
    //       nutrition["isEatWell"] = true;
    //     } else if (icon.Name == "Made With Whole Grains") {
    //       nutrition["isWholeGrain"] = true;
    //     }
    //   }

    //   const menuItem = {
    //     name: productName,
    //     description: description,
    //     nutrition: nutrition,
    //   };
    //   if (!(categoryName in stationMenu[stationName])) {
    //     stationMenu[stationName][categoryName] = [];
    //   }
    //   stationMenu[stationName][categoryName].push(menuItem);
    // }

    // //Turn all data into the format of [stationMenu]
    // const all = [];

    // for (const stationName in stationMenu) {
    //   const category_item_list = [];
    //   for (const category in stationMenu[stationName]) {
    //     category_item_list.push({
    //       category: category,
    //       items: stationMenu[stationName][category],
    //     });
    //   }
    //   all.push({
    //     station: stationName,
    //     menu: category_item_list,
    //   });
    // }

    // serialize
    console.log(dateString);

    const date = new Date(dateString);

    console.log(date);
    console.log(location, date, mealPeriod);

    const all = await menuService.getMenu({ location, date, mealPeriod });

    // // build the data we want to return to the client
    const data = {
      all: all,
    };

    return {
      statusCode: 200,
      body: JSON.stringify(data, null, 4),
    };
  } catch (error) {
    console.log(error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "There is no menu today",
      }),
    };
  }
};

export { handler };
