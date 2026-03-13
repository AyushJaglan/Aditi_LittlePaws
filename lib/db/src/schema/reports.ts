import { pgTable, serial, text, real, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const reportsTable = pgTable("reports", {
  id: serial("id").primaryKey(),
  caseId: text("case_id").notNull().unique(),
  reporterName: text("reporter_name").notNull(),
  reporterPhone: text("reporter_phone").notNull(),
  reporterEmail: text("reporter_email").notNull(),
  animalType: text("animal_type").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  locationAddress: text("location_address").notNull(),
  district: text("district").notNull(),
  state: text("state").notNull(),
  photoUrl: text("photo_url"),
  status: text("status").notNull().default("reported"),
  assignedVetId: integer("assigned_vet_id"),
  assignedHospitalId: integer("assigned_hospital_id"),
  treatmentNotes: text("treatment_notes"),
  recoveryPhotoUrl: text("recovery_photo_url"),
  medicalReport: text("medical_report"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertReportSchema = createInsertSchema(reportsTable).omit({
  id: true,
  caseId: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reportsTable.$inferSelect;
