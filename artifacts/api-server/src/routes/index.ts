import { Router, type IRouter } from "express";
import healthRouter from "./health";
import konfirmasiRouter from "./konfirmasi";
import adminRouter from "./admin";
import catalogRouter from "./catalog";

const router: IRouter = Router();

router.use(healthRouter);
router.use(konfirmasiRouter);
router.use(adminRouter);
router.use(catalogRouter);

export default router;
