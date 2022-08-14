import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import moment from "moment";

const prisma = new PrismaClient();

const checkStockCapacity = async (req: Request, res: Response) => {
  try {
    let stock = await prisma.stock.findFirstOrThrow({
      where: {
        date: new Date(moment.utc(req.params.date).toDate()),
      },
    });
    res.status(200).json({ capacity: stock.milkCapacity });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json(error);
  }
};

export { checkStockCapacity };
