import express from "express";
import cors from "cors";
import { Routers } from "./app/routers";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./utils/notFound";

const app = express();

//! use  parser
app.use(cors());
app.use(express.json());

//! routers use
app.use("/api/v1", Routers);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//! error
app.use(globalErrorHandler);
//! not found path
app.use(notFound);
export default app;
