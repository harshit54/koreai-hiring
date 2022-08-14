import express, { Express, Request, Response } from "express";
import order from "./routes/order";
import stock from "./routes/stock";
import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerOptions } from "swagger-ui-express";
const swagger = require("swagger-ui-express");
const app: Express = express();
const port = process.env.PORT || 5000;

const swaggerOptions: SwaggerOptions = {
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

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swagger.serve, swagger.setup(swaggerDocs));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`⚡[server]: Server is running at https://localhost:${port}`);
});

app.use(express.json());
app.use("/", order);
app.use("/", stock);
