import { isValid, parse } from "date-fns";

export function parseDate(dateString: string): Date | null {
  const date = parse(dateString, "MM/dd/yyyy", new Date());

  return isValid(date) ? date : null;
}

/**
 * example input: "APRIL 22 11:00 AM"
 * example output: new Date("April 22, 2022 11:00 AM")
 */
export function parseEventDate(dateStr: string): Date | null {
  const parts = dateStr.trim().split(" ") as [string, string, string, string];

  if (parts.length !== 4) {
    console.error("invalid date format", dateStr);
    return null;
  }

  const month = parts[0].charAt(0) + parts[0].slice(1).toLowerCase(); // e.g. "APRIL" -> "April"
  const day = parts[1];
  const time = `${parts[2]} ${parts[3]}`; // e.g. "11:00 AM"
  const currentYear = new Date().getFullYear();
  const fullDateStr = `${month} ${day}, ${currentYear} ${time}`; // e.g. "April 22, 2022 11:00 AM"

  return new Date(fullDateStr);
}
