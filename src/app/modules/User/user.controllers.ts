import status from "http-status";
import catchAsync from "../../../utils/share/catchAsync";
import sendResponse from "../../../utils/share/sendResponse";
import { UserServices } from "./user.services";
import pick from "../../../utils/search/pick";
import { userFilterableFields } from "./user.constants";
import { paginationFilterableField } from "../../../utils/pagination/pagination";

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

const getAllUserFromDB = catchAsync(async (req, res, next) => {
   const filters = pick(req.query, userFilterableFields);
   const options = pick(req.query, paginationFilterableField);
  const data = await UserServices.getAllUserFromDB(filters, options);
  sendResponse(res, {
    statusCode: status.OK,
    message: "Users are retrieved Successfully",
    data: data,
  });
});

export const UserControllers = {
  createAdmin,
  createCustomer,
  getAllUserFromDB,
};
