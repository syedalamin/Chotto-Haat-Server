import express from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { CategoryControllers } from "./category.controllers";
const router = express.Router();

router.post(
  "/create-category",
  auth(UserRole.ADMIN),
  CategoryControllers.createCategoryIntoDB
);
router.post(
  "/",
  auth(UserRole.ADMIN),
  CategoryControllers.getAllCategoryFromDB
);
router.post("/:id", auth(UserRole.ADMIN), CategoryControllers.getByIdFromDB);
router.post("/:id", auth(UserRole.ADMIN), CategoryControllers.updateByIdIntoDB);
router.post("/:id", auth(UserRole.ADMIN), CategoryControllers.deleteByIdFromDB);

export const CategoryRoutes = router;
