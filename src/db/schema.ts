import { integer, pgTable, timestamp } from "drizzle-orm/pg-core";

export const propertyTable = pgTable("property", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    checkInDate: timestamp().notNull(),
    checkOutDate: timestamp().notNull(),
})