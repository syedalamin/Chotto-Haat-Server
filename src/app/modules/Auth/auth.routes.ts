import express from "express";
import { AuthControllers } from "./auth.controllers";

const router = express.Router();

router.post("/login", AuthControllers.login);
router.post("/refresh-token", AuthControllers.refreshToken);
export const AuthRoutes = router;
