import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import * as moment from "moment";

const prisma = new PrismaClient();

enum StatusEnum {
  placed = "PLACED",
  packed = "PACKED",
  dispatched = "DISPATCHED",
  delivered = "DELIVERED",
}

const createOrder = async (req: Request, res: Response) => {
  try {
    console.log("Body: ", req.body);
    await prisma.user.findFirstOrThrow({
      where: {
        id: req.body.id,
      },
    });
    let stock = await prisma.stock.findFirstOrThrow({
      where: {
        date: new Date(moment.utc(req.body.date).toDate()),
      },
    });
    console.log("Stock: ", stock.milkCapacity);
    if (stock.milkCapacity < req.body.quantity) {
      res.status(400).json({ Error: "Not Enough Milk!" });
      return;
    }
    if (req.body.quantity <= 0) {
      res.status(400).json({ Error: "Quantity Not Allowed!" });
      return;
    }
    stock.milkCapacity -= req.body.quantity;
    let response = await prisma.order.create({
      data: {
        date: new Date(moment.utc(req.body.date).toDate()),
        userId: req.body.userId,
        quantity: req.body.quantity,
        status: StatusEnum.placed,
      },
    });
    await prisma.stock.update({
      where: {
        id: stock.id,
      },
      data: {
        milkCapacity: stock.milkCapacity,
      },
    });
    res.status(201).json(response);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json(error);
  }
};

const updateOrder = async (req: Request, res: Response) => {
  try {
    let prevOrder = await prisma.order.findFirstOrThrow({
      where: {
        id: Number(req.params.id),
      },
    });
    await prisma.user.findFirstOrThrow({
      where: {
        id: req.body.userId,
      },
    });
    let stock = await prisma.stock.findFirstOrThrow({
      where: {
        date: new Date(moment.utc(prevOrder.date).toDate()),
      },
    });
    let stockNew = await prisma.stock.findFirstOrThrow({
      where: {
        date: new Date(moment.utc(req.body.date).toDate()),
      },
    });
    console.log("Stock: ", stock.milkCapacity);
    let newStock =
      stockNew.milkCapacity +
      (prevOrder.date == stockNew.date ? prevOrder.quantity : 0);
    if (newStock < req.body.quantity) {
      res.status(400).json({ Error: "Not Enough Milk!" });
      return;
    }
    if (req.body.quantity <= 0) {
      res.status(400).json({ Error: "Quantity Not Allowed!" });
      return;
    }
    await prisma.stock.update({
      where: {
        id: stock.id,
      },
      data: {
        milkCapacity: stock.milkCapacity,
      },
    });
    let response = await prisma.order.update({
      data: {
        date: req.body.date
          ? new Date(moment.utc(req.body.date).toDate())
          : prevOrder.date,
        userId: req.body.userId ? req.body.userId : prevOrder.userId,
        quantity: req.body.quantity ? req.body.quantity : prevOrder.quantity,
      },
      where: {
        id: prevOrder.id,
      },
    });
    await prisma.stock.update({
      where: {
        id: stock.id,
      },
      data: {
        milkCapacity: stock.milkCapacity + prevOrder.quantity,
      },
    });
    await prisma.stock.update({
      where: {
        id: stockNew.id,
      },
      data: {
        milkCapacity: stockNew.milkCapacity - req.body.quantity,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json(error);
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    let prevOrder = await prisma.order.findFirstOrThrow({
      where: {
        id: Number(req.params.id),
      },
    });
    if (
      req.body.status &&
      !Object.values(StatusEnum).includes(req.body.status)
    ) {
      res.status(400).json({ Error: "Invalid Status" });
      return;
    }
    let response = await prisma.order.update({
      data: {
        status: req.body.status,
      },
      where: {
        id: prevOrder.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json(error);
  }
};

const deleteOrder = async (req: Request, res: Response) => {
  try {
    let prevOrder = await prisma.order.findFirstOrThrow({
      where: {
        id: Number(req.params.id),
      },
    });
    let stock = await prisma.stock.findFirstOrThrow({
      where: {
        date: moment.utc(prevOrder.date).toDate(),
      },
    });
    await prisma.order.delete({
      where: {
        id: prevOrder.id,
      },
    });
    await prisma.stock.update({
      where: {
        id: stock.id,
      },
      data: {
        milkCapacity: stock.milkCapacity + prevOrder.quantity,
      },
    });
    res.status(204).json({ Status: "Deleted Successfully" });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json(error);
  }
};

export { createOrder, updateOrder, updateOrderStatus, deleteOrder };
