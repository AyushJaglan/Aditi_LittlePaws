import { Router, type IRouter } from "express";
import { db, adoptionsTable, animalsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const { status } = req.query;
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;

    const where = status ? eq(adoptionsTable.status, String(status)) : undefined;

    const [adoptions, totalResult] = await Promise.all([
      db.select({
        id: adoptionsTable.id,
        animalId: adoptionsTable.animalId,
        applicantName: adoptionsTable.applicantName,
        applicantEmail: adoptionsTable.applicantEmail,
        applicantPhone: adoptionsTable.applicantPhone,
        applicantAddress: adoptionsTable.applicantAddress,
        applicantDistrict: adoptionsTable.applicantDistrict,
        applicantState: adoptionsTable.applicantState,
        housingType: adoptionsTable.housingType,
        hasOtherPets: adoptionsTable.hasOtherPets,
        hasChildren: adoptionsTable.hasChildren,
        reasonForAdoption: adoptionsTable.reasonForAdoption,
        experience: adoptionsTable.experience,
        status: adoptionsTable.status,
        animalName: animalsTable.name,
        animalSpecies: animalsTable.species,
        animalPhotoUrl: animalsTable.photoUrl,
        createdAt: adoptionsTable.createdAt,
        updatedAt: adoptionsTable.updatedAt,
      })
        .from(adoptionsTable)
        .leftJoin(animalsTable, eq(adoptionsTable.animalId, animalsTable.id))
        .where(where)
        .limit(limit)
        .offset(offset)
        .orderBy(adoptionsTable.createdAt),
      db.select({ count: count() }).from(adoptionsTable).where(where),
    ]);

    res.json({ adoptions, total: totalResult[0].count });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch adoptions" });
  }
});

router.post("/", async (req, res) => {
  try {
    const [adoption] = await db.insert(adoptionsTable).values({
      ...req.body,
      status: "pending",
    }).returning();
    res.status(201).json(adoption);
  } catch (err) {
    res.status(500).json({ error: "Failed to submit adoption application" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const [updated] = await db.update(adoptionsTable)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(adoptionsTable.id, id))
      .returning();
    if (!updated) return res.status(404).json({ error: "Adoption not found" });

    // If approved, mark animal as adopted
    if (req.body.status === "approved") {
      await db.update(animalsTable)
        .set({ status: "adopted", updatedAt: new Date() })
        .where(eq(animalsTable.id, updated.animalId));
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update adoption" });
  }
});

export default router;
