"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_1 = __importDefault(require("./routes/order"));
const stock_1 = __importDefault(require("./routes/stock"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger = require("swagger-ui-express");
const app = (0, express_1.default)();
const port = 5000;
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            version: "1.0.0",
            title: "Kore.ai API Documentation",
            description: "Client API Information",
            contact: {
                name: "Harshit Joshi",
            },
            servers: ["http://localhost:5000"],
        },
    },
    apis: ["./src/index.ts", "./src/routes/*.ts"],
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use("/api-docs", swagger.serve, swagger.setup(swaggerDocs));
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
app.listen(port, () => {
    console.log(`⚡[server]: Server is running at https://localhost:${port}`);
});
app.use(express_1.default.json());
app.use("/", order_1.default);
app.use("/", stock_1.default);
//# sourceMappingURL=index.js.map