import { pgTable, serial, text, real, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const hospitalsTable = pgTable("hospitals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  district: text("district").notNull(),
  state: text("state").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  totalBeds: integer("total_beds"),
  availableBeds: integer("available_beds"),
  isGovernment: boolean("is_government").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertHospitalSchema = createInsertSchema(hospitalsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertHospital = z.infer<typeof insertHospitalSchema>;
export type Hospital = typeof hospitalsTable.$inferSelect;
