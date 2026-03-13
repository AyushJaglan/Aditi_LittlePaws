import { Router, type IRouter } from "express";
import healthRouter from "./health";
import reportsRouter from "./reports";
import casesRouter from "./cases";
import animalsRouter from "./animals";
import adoptionsRouter from "./adoptions";
import productsRouter from "./products";
import volunteersRouter from "./volunteers";
import vetsRouter from "./vets";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/reports", reportsRouter);
router.use("/cases", casesRouter);
router.use("/animals", animalsRouter);
router.use("/adoptions", adoptionsRouter);
router.use("/products", productsRouter);
router.use("/volunteers", volunteersRouter);
router.use(vetsRouter);
router.use("/stats", statsRouter);

export default router;
