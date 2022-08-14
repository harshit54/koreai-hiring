"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stock_1 = require("../controller/stock");
const router = (0, express_1.Router)();
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
router.get("/checkCapacity/:date", stock_1.checkStockCapacity);
exports.default = router;
//# sourceMappingURL=stock.js.map