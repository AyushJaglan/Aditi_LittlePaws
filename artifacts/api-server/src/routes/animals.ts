import { Router, type IRouter } from "express";
import { db, animalsTable } from "@workspace/db";
import { eq, and, ilike, count } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const { species, state, gender } = req.query;
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;

    const conditions = [eq(animalsTable.status, "available")];
    if (species) conditions.push(ilike(animalsTable.species, `%${species}%`));
    if (state) conditions.push(ilike(animalsTable.shelterState, `%${state}%`));
    if (gender) conditions.push(eq(animalsTable.gender, String(gender)));

    const where = and(...conditions);

    const [animals, totalResult] = await Promise.all([
      db.select().from(animalsTable).where(where).limit(limit).offset(offset).orderBy(animalsTable.createdAt),
      db.select({ count: count() }).from(animalsTable).where(where),
    ]);

    res.json({ animals, total: totalResult[0].count });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch animals" });
  }
});

router.post("/", async (req, res) => {
  try {
    const [animal] = await db.insert(animalsTable).values({
      ...req.body,
      status: "available",
    }).returning();
    res.status(201).json(animal);
  } catch (err) {
    res.status(500).json({ error: "Failed to create animal" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [animal] = await db.select().from(animalsTable).where(eq(animalsTable.id, id));
    if (!animal) return res.status(404).json({ error: "Animal not found" });
    res.json(animal);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch animal" });
  }
});

export default router;
