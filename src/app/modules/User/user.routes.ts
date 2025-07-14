import express from "express";
import { UserControllers } from "./user.controllers";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";
import { upload } from "../../../utils/fileUploader";
import formDataParser from "../../../utils/formDataParser";

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
  upload.single("file"),
  formDataParser,
  validateRequest(UserValidations.customerValidation),
  UserControllers.createCustomer
);

export const UserRoutes = router;
