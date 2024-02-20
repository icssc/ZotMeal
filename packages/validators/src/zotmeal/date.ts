import { z } from "zod";

export const DateRegex = z
  .string()
  .regex(
    RegExp(
      "^((0?[1-9]|1[012])[/](0?[1-9]|[12][0-9]|3[01])[/](19|20)?[0-9]{2})*$",
    ),
  );
