import { Router, type IRouter } from "express";
import { db, productsTable } from "@workspace/db";
import { eq, ilike, and, count, or } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    const limit = Number(req.query.limit) || 20;
    const offset = Number(req.query.offset) || 0;

    const conditions = [];
    if (category) conditions.push(eq(productsTable.category, String(category)));
    if (search) {
      conditions.push(
        or(
          ilike(productsTable.name, `%${search}%`),
          ilike(productsTable.description, `%${search}%`)
        )
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [products, totalResult] = await Promise.all([
      db.select().from(productsTable).where(where).limit(limit).offset(offset).orderBy(productsTable.createdAt),
      db.select({ count: count() }).from(productsTable).where(where),
    ]);

    res.json({ products, total: totalResult[0].count });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

router.post("/", async (req, res) => {
  try {
    const [product] = await db.insert(productsTable).values(req.body).returning();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to create product" });
  }
});

export default router;
