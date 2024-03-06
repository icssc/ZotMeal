import { dietRestriction } from "./dietRestriction";
import { dish } from "./dish";
import { event } from "./event";
import { menu } from "./menu";
import { nutritionInfo } from "./nutritionInfo";
import { pushToken } from "./pushToken";
import { restaurant } from "./restaurant";
import { station } from "./station";

export const schema = {
  ...dietRestriction,
  ...nutritionInfo,
  ...dish,
  ...event,
  ...menu,
  ...restaurant,
  ...station,
  ...pushToken,
};

export * from "./dish";
export * from "./event";
export * from "./menu";
export * from "./restaurant";
export * from "./station";
export * from "./pushToken";
