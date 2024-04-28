import { format } from "date-fns";

import { env } from "../env";

export const main = async (event, context) => {
  try {
    const now = new Date();
    const formattedTime = format(now, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    console.log(`Time: ${formattedTime}`);
  } catch (error) {
    console.error("Failed to execute weekly task", error);
  }
};
