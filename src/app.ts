import express from "express";
import cors from "cors";
import { Routers } from "./app/routers";

const app = express();

//! use  parser
app.use(cors());
app.use(express.json());




//! routers use
app.use("/api/v1", Routers);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
