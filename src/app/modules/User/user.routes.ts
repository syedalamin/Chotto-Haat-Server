import express from "express";
import { UserControllers } from "./user.controllers";

const router = express.Router();

router.post("/create-admin", UserControllers.createAdmin);

export const UserRoutes = router;
