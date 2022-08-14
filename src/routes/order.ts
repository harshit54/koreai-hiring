import { Router, Request, Response } from "express";
import {
  createOrder,
  deleteOrder,
  updateOrder,
  updateOrderStatus,
} from "../controller/order";

const router: Router = Router();

/**
 * @openapi
 * /orders/add:
 *   post:
 *     tags:
 *         - Orders
 *     description: Create a new order if milk capacity > required.
 *     responses:
 *       201:
 *         description: Order Created Successfully
 *       400:
 *         description: Not Enough Milk
 *       500:
 *         description: Internal Server Error(Check Response)
 */
router.post("/add", createOrder);

/**
 * @openapi
 * /update/:id:
 *   patch:
 *     tags:
 *         - Orders
 *     description: Update an existing order based on stock allocations.
 *     responses:
 *       200:
 *         description: Order Updated Successfully
 *       403:
 *         description: Order Not Allowed
 *       500:
 *         description: Failed
 */
router.patch("/update/:id", updateOrder);

/**
 * @openapi
 * /updateStatus/:id:
 *   patch:
 *     tags:
 *         - Orders
 *     description: Update status of an existing order
 *     responses:
 *       200:
 *         description: Order Status Updated Successfully
 *       403:
 *         description: Order Status Not Allowed
 *       500:
 *         description: Failed
 */
router.patch("/updateStatus/:id", updateOrderStatus);

/**
 * @openapi
 * /delete/:id:
 *   delete:
 *     tags:
 *         - Orders
 *     description: Delete Existing Order
 *     responses:
 *       204:
 *         description: Order Deleted Successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Failed
 */
router.delete("/delete/:id", deleteOrder);

export default router;
