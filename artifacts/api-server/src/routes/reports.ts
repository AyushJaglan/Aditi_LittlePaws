import { Router, type IRouter } from "express";
import { db, reportsTable, casesTable } from "@workspace/db";
import { eq, and, ilike, count } from "drizzle-orm";

const router: IRouter = Router();

function generateCaseId(): string {
  const prefix = "ARI";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

router.get("/", async (req, res) => {
  try {
    const { status, district, state, severity } = req.query;
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;

    const conditions = [];
    if (status) conditions.push(eq(reportsTable.status, String(status)));
    if (district) conditions.push(ilike(reportsTable.district, `%${district}%`));
    if (state) conditions.push(ilike(reportsTable.state, `%${state}%`));
    if (severity) conditions.push(eq(reportsTable.severity, String(severity)));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [reports, totalResult] = await Promise.all([
      db.select().from(reportsTable).where(where).limit(limit).offset(offset).orderBy(reportsTable.createdAt),
      db.select({ count: count() }).from(reportsTable).where(where),
    ]);

    res.json({ reports, total: totalResult[0].count });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const caseId = generateCaseId();

    const [report] = await db.insert(reportsTable).values({
      ...data,
      caseId,
      status: "reported",
    }).returning();

    // Also create a case record
    await db.insert(casesTable).values({
      caseId,
      animalType: data.animalType,
      description: data.description,
      severity: data.severity,
      status: "reported",
      district: data.district,
      state: data.state,
      latitude: data.latitude,
      longitude: data.longitude,
      locationAddress: data.locationAddress,
      photoUrl: data.photoUrl,
      reportId: report.id,
    });

    res.status(201).json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create report" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [report] = await db.select().from(reportsTable).where(eq(reportsTable.id, id));
    if (!report) return res.status(404).json({ error: "Report not found" });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch report" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [updated] = await db.update(reportsTable)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(reportsTable.id, id))
      .returning();
    if (!updated) return res.status(404).json({ error: "Report not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update report" });
  }
});

export default router;
