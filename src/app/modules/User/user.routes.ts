import express from "express";
import { UserControllers } from "./user.controllers";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";
import { upload } from "../../../utils/fileUploader";
import formDataParser from "../../../utils/formDataParser";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create-admin",
  upload.single("file"),
  formDataParser,
  validateRequest(UserValidations.adminValidation),
  UserControllers.createAdmin
);
router.post(
  "/create-customer",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  upload.single("file"),
  formDataParser,
  validateRequest(UserValidations.customerValidation),
  UserControllers.createCustomer
);

export const UserRoutes = router;
