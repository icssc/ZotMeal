/** Courtesy of this thread:
 * @see https://github.com/drizzle-team/drizzle-orm/discussions/1480#discussioncomment-9363695
 */

import { pgGenerate } from "drizzle-dbml-generator";

import * as schema from "./src/schema";

pgGenerate({ schema, out: "./diagram/schema.dbml", relational: true });
console.log("✅ Generated dbml schema & diagram, check the diagram directory.");
