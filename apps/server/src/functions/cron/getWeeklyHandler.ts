import { format } from "date-fns";

export const main = async (event, context) => {
  try {
    const now = new Date();
    const formattedTime = format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    console.log(`Weekly task executed at: ${formattedTime}`);
    //TODO: get data from campusdish and put in db
  } catch (error) {
    console.error("Failed to execute weekly task", error);
  }
};
