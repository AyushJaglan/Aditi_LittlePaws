import { pgTable, serial, text, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const casesTable = pgTable("cases", {
  id: serial("id").primaryKey(),
  caseId: text("case_id").notNull().unique(),
  animalType: text("animal_type").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(),
  status: text("status").notNull().default("reported"),
  district: text("district").notNull(),
  state: text("state").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  locationAddress: text("location_address").notNull(),
  photoUrl: text("photo_url"),
  rescueTime: text("rescue_time"),
  firstAid: text("first_aid"),
  vetName: text("vet_name"),
  vetPhone: text("vet_phone"),
  hospitalName: text("hospital_name"),
  treatmentUpdates: text("treatment_updates"),
  recoveryProgress: text("recovery_progress"),
  recoveryPhotoUrl: text("recovery_photo_url"),
  medicalReport: text("medical_report"),
  releaseDetails: text("release_details"),
  reportId: integer("report_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCaseSchema = createInsertSchema(casesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCase = z.infer<typeof insertCaseSchema>;
export type Case = typeof casesTable.$inferSelect;
