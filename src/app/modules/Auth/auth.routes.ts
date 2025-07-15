import express from "express";
import { AuthControllers } from "./auth.controllers";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/login", AuthControllers.login);
router.post("/refresh-token", AuthControllers.refreshToken);
router.post(
  "/change-password",
  auth(UserRole.ADMIN, UserRole.CUSTOMER),
  AuthControllers.changePassword
);
export const AuthRoutes = router;
