import status from "http-status";
import catchAsync from "../../../utils/share/catchAsync";
import sendResponse from "../../../utils/share/sendResponse";
import { UserServices } from "./user.services";

const createAdmin = catchAsync(async (req, res, next) => {
  const data = await UserServices.createAdmin(req);
  sendResponse(res, {
    statusCode: status.OK,
    message: "Admin Created Successfully",
    data: data,
  });
});

const createCustomer = catchAsync(async (req, res, next) => {
  const data = await UserServices.createCustomer(req);
  sendResponse(res, {
    statusCode: status.OK,
    message: "Customer Created Successfully",
    data: data,
  });
});

export const UserControllers = {
  createAdmin,
  createCustomer
};
