import { Router, type IRouter } from "express";
import { db, volunteersTable } from "@workspace/db";
import { eq, ilike, and, count } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const { district, state } = req.query;
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;

    const conditions = [];
    if (district) conditions.push(ilike(volunteersTable.district, `%${district}%`));
    if (state) conditions.push(ilike(volunteersTable.state, `%${state}%`));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [volunteers, totalResult] = await Promise.all([
      db.select().from(volunteersTable).where(where).limit(limit).offset(offset).orderBy(volunteersTable.createdAt),
      db.select({ count: count() }).from(volunteersTable).where(where),
    ]);

    res.json({ volunteers, total: totalResult[0].count });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch volunteers" });
  }
});

router.post("/", async (req, res) => {
  try {
    const [volunteer] = await db.insert(volunteersTable).values({
      ...req.body,
      status: "active",
    }).returning();
    res.status(201).json(volunteer);
  } catch (err) {
    res.status(500).json({ error: "Failed to register volunteer" });
  }
});

export default router;
