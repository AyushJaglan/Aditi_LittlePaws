import { Router, type IRouter } from "express";
import { db, vetsTable, hospitalsTable } from "@workspace/db";
import { eq, ilike, and, count } from "drizzle-orm";

const router: IRouter = Router();

router.get("/vets", async (req, res) => {
  try {
    const { district, state } = req.query;
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;

    const conditions = [];
    if (district) conditions.push(ilike(vetsTable.district, `%${district}%`));
    if (state) conditions.push(ilike(vetsTable.state, `%${state}%`));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [vets, totalResult] = await Promise.all([
      db.select({
        id: vetsTable.id,
        name: vetsTable.name,
        email: vetsTable.email,
        phone: vetsTable.phone,
        specialization: vetsTable.specialization,
        registrationNumber: vetsTable.registrationNumber,
        hospitalId: vetsTable.hospitalId,
        hospitalName: hospitalsTable.name,
        district: vetsTable.district,
        state: vetsTable.state,
        isAvailable: vetsTable.isAvailable,
        createdAt: vetsTable.createdAt,
      })
        .from(vetsTable)
        .leftJoin(hospitalsTable, eq(vetsTable.hospitalId, hospitalsTable.id))
        .where(where)
        .limit(limit)
        .offset(offset)
        .orderBy(vetsTable.createdAt),
      db.select({ count: count() }).from(vetsTable).where(where),
    ]);

    res.json({ vets, total: totalResult[0].count });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vets" });
  }
});

router.post("/vets", async (req, res) => {
  try {
    const [vet] = await db.insert(vetsTable).values(req.body).returning();
    res.status(201).json(vet);
  } catch (err) {
    res.status(500).json({ error: "Failed to create vet" });
  }
});

router.get("/hospitals", async (req, res) => {
  try {
    const { district, state } = req.query;
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;

    const conditions = [];
    if (district) conditions.push(ilike(hospitalsTable.district, `%${district}%`));
    if (state) conditions.push(ilike(hospitalsTable.state, `%${state}%`));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [hospitals, totalResult] = await Promise.all([
      db.select().from(hospitalsTable).where(where).limit(limit).offset(offset).orderBy(hospitalsTable.createdAt),
      db.select({ count: count() }).from(hospitalsTable).where(where),
    ]);

    res.json({ hospitals, total: totalResult[0].count });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch hospitals" });
  }
});

router.post("/hospitals", async (req, res) => {
  try {
    const [hospital] = await db.insert(hospitalsTable).values(req.body).returning();
    res.status(201).json(hospital);
  } catch (err) {
    res.status(500).json({ error: "Failed to create hospital" });
  }
});

export default router;
