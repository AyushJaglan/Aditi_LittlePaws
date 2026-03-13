import { Router, type IRouter } from "express";
import { db, casesTable } from "@workspace/db";
import { eq, and, ilike, count } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const { status, district } = req.query;
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;

    const conditions = [];
    if (status) conditions.push(eq(casesTable.status, String(status)));
    if (district) conditions.push(ilike(casesTable.district, `%${district}%`));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [cases, totalResult] = await Promise.all([
      db.select().from(casesTable).where(where).limit(limit).offset(offset).orderBy(casesTable.createdAt),
      db.select({ count: count() }).from(casesTable).where(where),
    ]);

    res.json({ cases, total: totalResult[0].count });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cases" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [caseRecord] = await db.select().from(casesTable).where(eq(casesTable.id, id));
    if (!caseRecord) return res.status(404).json({ error: "Case not found" });
    res.json(caseRecord);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch case" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [updated] = await db.update(casesTable)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(casesTable.id, id))
      .returning();
    if (!updated) return res.status(404).json({ error: "Case not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update case" });
  }
});

export default router;
