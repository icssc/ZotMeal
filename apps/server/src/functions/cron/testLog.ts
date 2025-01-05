import { format } from "date-fns";

export const main = async (event, context) =>
  console.log(`Time: ${format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")}`);
