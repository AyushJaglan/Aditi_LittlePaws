import { Router, type IRouter } from "express";
import { db, reportsTable, animalsTable, adoptionsTable, vetsTable, hospitalsTable, volunteersTable } from "@workspace/db";
import { count, eq, ne, countDistinct } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const [
      totalReportsResult,
      activeRescuesResult,
      animalsRescuedResult,
      animalsAdoptedResult,
      registeredVetsResult,
      registeredHospitalsResult,
      registeredVolunteersResult,
      statesResult,
      districtsResult,
    ] = await Promise.all([
      db.select({ count: count() }).from(reportsTable),
      db.select({ count: count() }).from(reportsTable).where(eq(reportsTable.status, "in_treatment")),
      db.select({ count: count() }).from(reportsTable).where(ne(reportsTable.status, "reported")),
      db.select({ count: count() }).from(adoptionsTable).where(eq(adoptionsTable.status, "approved")),
      db.select({ count: count() }).from(vetsTable),
      db.select({ count: count() }).from(hospitalsTable),
      db.select({ count: count() }).from(volunteersTable),
      db.selectDistinct({ state: reportsTable.state }).from(reportsTable),
      db.selectDistinct({ district: reportsTable.district }).from(reportsTable),
    ]);

    res.json({
      totalReports: Number(totalReportsResult[0].count),
      activeRescues: Number(activeRescuesResult[0].count),
      animalsRescued: Number(animalsRescuedResult[0].count),
      animalsAdopted: Number(animalsAdoptedResult[0].count),
      registeredVets: Number(registeredVetsResult[0].count),
      registeredHospitals: Number(registeredHospitalsResult[0].count),
      registeredVolunteers: Number(registeredVolunteersResult[0].count),
      statesCovered: statesResult.length,
      districtsCovered: districtsResult.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
