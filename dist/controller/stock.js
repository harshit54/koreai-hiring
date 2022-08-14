"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkStockCapacity = void 0;
const client_1 = require("@prisma/client");
const moment_1 = __importDefault(require("moment"));
const prisma = new client_1.PrismaClient();
const checkStockCapacity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let stock = yield prisma.stock.findFirstOrThrow({
            where: {
                date: new Date(moment_1.default.utc(req.params.date).toDate()),
            },
        });
        res.status(200).json({ capacity: stock.milkCapacity });
    }
    catch (error) {
        console.log("Error: ", error);
        res.status(500).json(error);
    }
});
exports.checkStockCapacity = checkStockCapacity;
//# sourceMappingURL=stock.js.map