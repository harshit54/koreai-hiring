import { Router, Request, Response } from "express";
import { checkStockCapacity } from "../controller/stock";
const router: Router = Router();

/**
 * @openapi
 * /checkCapacity/:date:
 *   get:
 *     tags:
 *         - Stock
 *     description: Check Stock For Particular Date
 *     responses:
 *       200:
 *         description: Successful
 *       500:
 *         description: Failed
 */
router.get("/checkCapacity/:date", checkStockCapacity);

export default router;
