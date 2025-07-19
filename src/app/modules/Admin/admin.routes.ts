import express from "express";
import { AdminControllers } from "./admin.controllers";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/", auth(UserRole.ADMIN), AdminControllers.getAllAdmins);

export const AdminRoutes = router;
