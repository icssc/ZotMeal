import { format } from "date-fns";
import { getWeekInfo } from "@zotmeal/api/src/services/getWeekInfo";
import { RestaurantName } from "@zotmeal/db"; 

export const main = async (event, context) => {
  try {
    const now = new Date();
    const formattedTime = format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    console.log(`Weekly task executed at: ${formattedTime}`);

    //TODO: get data from campusdish and put in db
    const formattedDate = format(now, "MM/dd/yyyy");
    getWeekInfo(
      context,
      {"date": formattedDate, "restaurant": RestaurantName.anteatery});
    getWeekInfo(
      context,
      {"date": formattedDate, "restaurant": RestaurantName.brandywine});
  } catch (error) {
    console.error("Failed to execute weekly task", error);
  }
};
