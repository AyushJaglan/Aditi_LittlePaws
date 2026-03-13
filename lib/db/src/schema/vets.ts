import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const vetsTable = pgTable("vets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  specialization: text("specialization"),
  registrationNumber: text("registration_number").notNull(),
  hospitalId: integer("hospital_id"),
  district: text("district").notNull(),
  state: text("state").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertVetSchema = createInsertSchema(vetsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertVet = z.infer<typeof insertVetSchema>;
export type Vet = typeof vetsTable.$inferSelect;
