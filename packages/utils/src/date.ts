import { format, isValid, parse } from "date-fns";

export function parseDate(dateString: string): Date | null {
  const date = parse(dateString, "MM/dd/yyyy", new Date());

  return isValid(date) ? date : null;
}

export function formatDate(date: Date): string | null {
  const dateString = format(date, "MM/dd/yyyy");
  return dateString;
}
