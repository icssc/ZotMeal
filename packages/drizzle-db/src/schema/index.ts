import { dishes } from "./dish";
import { event } from "./event";
import { menu } from "./menu";
import { restaurant } from "./restaurant";
import { station } from "./station";
import { pushToken } from "./users";

export * from "./dish";
export * from "./event";
export * from "./menu";
export * from "./restaurant";
export * from "./station";
export * from "./users";

export const schema = {
  ...dishes,
  ...event,
  ...menu,
  ...restaurant,
  ...station,
  ...pushToken,
};
