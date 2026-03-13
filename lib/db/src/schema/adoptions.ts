import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const adoptionsTable = pgTable("adoptions", {
  id: serial("id").primaryKey(),
  animalId: integer("animal_id").notNull(),
  applicantName: text("applicant_name").notNull(),
  applicantEmail: text("applicant_email").notNull(),
  applicantPhone: text("applicant_phone").notNull(),
  applicantAddress: text("applicant_address").notNull(),
  applicantDistrict: text("applicant_district").notNull(),
  applicantState: text("applicant_state").notNull(),
  housingType: text("housing_type").notNull(),
  hasOtherPets: boolean("has_other_pets").notNull().default(false),
  hasChildren: boolean("has_children").notNull().default(false),
  reasonForAdoption: text("reason_for_adoption").notNull(),
  experience: text("experience"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAdoptionSchema = createInsertSchema(adoptionsTable).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAdoption = z.infer<typeof insertAdoptionSchema>;
export type Adoption = typeof adoptionsTable.$inferSelect;
