import { errorMiddleware } from "./middlewares/error-middleware";
import BookRouter from "./routes/book";
import UserRouter from "./routes/auth";
import path from "path";
import express from "express";

const app = express();
const appHost = process.env.APP_HOST || "localhost";
const appPort = process.env.APP_PORT || 3000;

app.use(express.json());
app.use("/uploads", express.static(path.join("public", "uploads")));

app.use("/api/auth", UserRouter);
app.use("/api/books", BookRouter);

app.use(errorMiddleware);

app.listen(appPort, () => {
  console.log(`Server running on port http://${appHost}:${appPort}/api`);
});
