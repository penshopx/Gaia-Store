import { Router, type IRouter } from "express";
import healthRouter from "./health";
import konfirmasiRouter from "./konfirmasi";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(konfirmasiRouter);
router.use(adminRouter);

export default router;
