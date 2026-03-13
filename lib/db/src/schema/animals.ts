import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const animalsTable = pgTable("animals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  species: text("species").notNull(),
  breed: text("breed"),
  age: text("age").notNull(),
  gender: text("gender").notNull(),
  color: text("color"),
  weight: text("weight"),
  vaccinationStatus: text("vaccination_status").notNull(),
  medicalHistory: text("medical_history"),
  temperament: text("temperament"),
  rescueStory: text("rescue_story"),
  shelterName: text("shelter_name").notNull(),
  shelterDistrict: text("shelter_district").notNull(),
  shelterState: text("shelter_state").notNull(),
  photoUrl: text("photo_url"),
  additionalPhotos: text("additional_photos"),
  status: text("status").notNull().default("available"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAnimalSchema = createInsertSchema(animalsTable).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAnimal = z.infer<typeof insertAnimalSchema>;
export type Animal = typeof animalsTable.$inferSelect;
