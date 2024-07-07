import type {
  PgInsert,
  PgInsertOnConflictDoUpdateConfig,
  PgInsertValue,
  PgTableWithColumns,
  TableConfig,
} from "drizzle-orm/pg-core";

import type { Drizzle } from "@zotmeal/db";

// ! typeguard only for this file
const isNotQueryResultNever = <T extends TableConfig>(
  result: unknown,
): result is PgTableWithColumns<T>["$inferSelect"][] => Array.isArray(result);

/** Convenience function to upsert a record in a table. */
export async function upsert<T extends TableConfig>(
  db: Drizzle,
  table: PgTableWithColumns<T>,
  value: PgInsertValue<PgTableWithColumns<T>>,
  config: PgInsertOnConflictDoUpdateConfig<PgInsert<PgTableWithColumns<T>>>,
) {
  const result = await db
    .insert(table)
    .values(value)
    .onConflictDoUpdate(config)
    .returning();

  if (!isNotQueryResultNever(result))
    throw new Error(
      `upsert: no result for table '${table._.name}' with config ${JSON.stringify(config)}`,
    );

  if (!result[0]) throw new Error("upsert: no result");

  return result[0];
}
