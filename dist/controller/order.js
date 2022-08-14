"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrderStatus = exports.updateOrder = exports.createOrder = void 0;
const client_1 = require("@prisma/client");
const moment = __importStar(require("moment"));
const prisma = new client_1.PrismaClient();
var StatusEnum;
(function (StatusEnum) {
    StatusEnum["placed"] = "PLACED";
    StatusEnum["packed"] = "PACKED";
    StatusEnum["dispatched"] = "DISPATCHED";
    StatusEnum["delivered"] = "DELIVERED";
})(StatusEnum || (StatusEnum = {}));
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Body: ", req.body);
        yield prisma.user.findFirstOrThrow({
            where: {
                id: req.body.id,
            },
        });
        let stock = yield prisma.stock.findFirstOrThrow({
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
        let response = yield prisma.order.create({
            data: {
                date: new Date(moment.utc(req.body.date).toDate()),
                userId: req.body.userId,
                quantity: req.body.quantity,
                status: StatusEnum.placed,
            },
        });
        yield prisma.stock.update({
            where: {
                id: stock.id,
            },
            data: {
                milkCapacity: stock.milkCapacity,
            },
        });
        res.status(201).json(response);
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json(error);
    }
});
exports.createOrder = createOrder;
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let prevOrder = yield prisma.order.findFirstOrThrow({
            where: {
                id: Number(req.params.id),
            },
        });
        yield prisma.user.findFirstOrThrow({
            where: {
                id: req.body.userId,
            },
        });
        let stock = yield prisma.stock.findFirstOrThrow({
            where: {
                date: new Date(moment.utc(prevOrder.date).toDate()),
            },
        });
        let stockNew = yield prisma.stock.findFirstOrThrow({
            where: {
                date: new Date(moment.utc(req.body.date).toDate()),
            },
        });
        console.log("Stock: ", stock.milkCapacity);
        let newStock = stockNew.milkCapacity +
            (prevOrder.date == stockNew.date ? prevOrder.quantity : 0);
        if (newStock < req.body.quantity) {
            res.status(400).json({ Error: "Not Enough Milk!" });
            return;
        }
        if (req.body.quantity <= 0) {
            res.status(400).json({ Error: "Quantity Not Allowed!" });
            return;
        }
        yield prisma.stock.update({
            where: {
                id: stock.id,
            },
            data: {
                milkCapacity: stock.milkCapacity,
            },
        });
        let response = yield prisma.order.update({
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
        yield prisma.stock.update({
            where: {
                id: stock.id,
            },
            data: {
                milkCapacity: stock.milkCapacity + prevOrder.quantity,
            },
        });
        yield prisma.stock.update({
            where: {
                id: stockNew.id,
            },
            data: {
                milkCapacity: stockNew.milkCapacity - req.body.quantity,
            },
        });
        res.status(200).json(response);
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json(error);
    }
});
exports.updateOrder = updateOrder;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let prevOrder = yield prisma.order.findFirstOrThrow({
            where: {
                id: Number(req.params.id),
            },
        });
        if (req.body.status &&
            !Object.values(StatusEnum).includes(req.body.status)) {
            res.status(400).json({ Error: "Invalid Status" });
            return;
        }
        let response = yield prisma.order.update({
            data: {
                status: req.body.status,
            },
            where: {
                id: prevOrder.id,
            },
        });
        res.status(200).json(response);
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json(error);
    }
});
exports.updateOrderStatus = updateOrderStatus;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let prevOrder = yield prisma.order.findFirstOrThrow({
            where: {
                id: Number(req.params.id),
            },
        });
        let stock = yield prisma.stock.findFirstOrThrow({
            where: {
                date: moment.utc(prevOrder.date).toDate(),
            },
        });
        yield prisma.order.delete({
            where: {
                id: prevOrder.id,
            },
        });
        yield prisma.stock.update({
            where: {
                id: stock.id,
            },
            data: {
                milkCapacity: stock.milkCapacity + prevOrder.quantity,
            },
        });
        res.status(204).json({ Status: "Deleted Successfully" });
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json(error);
    }
});
exports.deleteOrder = deleteOrder;
//# sourceMappingURL=order.js.map