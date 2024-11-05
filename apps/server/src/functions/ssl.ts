import fs from "fs";
import path from "path";
import { ConnectionOptions } from "tls";

export const ssl =
  process.env.NODE_ENV === "production"
    ? ({
        rejectUnauthorized: false,
        ca: fs.readFileSync(
          path
            .join(__dirname, "../../../certs", "global-bundle.pem")
            .toString(),
        ),
      } satisfies ConnectionOptions)
    : undefined;
