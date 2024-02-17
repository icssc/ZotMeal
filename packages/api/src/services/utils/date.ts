import { isValid, parse } from "date-fns";

export function parseDate(dateString: string) {
  const date = parse(dateString, "MM/dd/yyyy", new Date());

  return isValid(date) ? date : null;
}
