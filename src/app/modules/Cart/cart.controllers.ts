import status from "http-status";
import catchAsync from "../../../utils/share/catchAsync";
import sendResponse from "../../../utils/share/sendResponse";
import { CartServices } from "./cart.services";


const createDataIntoDB = catchAsync(async (req, res) => {
  const result = await CartServices.createDataIntoDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "Cart is created successfully",
    data: result,
  });
});
const getAllDataFromDB = catchAsync(async (req, res) => {
  const result = await CartServices.getAllDataFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "Cart are retrieved successfully",
    data: result,
  });
});
const getByIdFromDB = catchAsync(async (req, res) => {
  const result = await CartServices.getByIdFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "Cart is retrieved successfully",
    data: result,
  });
});
const updateByIdIntoDB = catchAsync(async (req, res) => {
  const result = await CartServices.updateByIdIntoDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "Cart is updated successfully",
    data: result,
  });
});
const deleteByIdFromDB = catchAsync(async (req, res) => {
  const result = await CartServices.deleteByIdFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "Cart is deleted successfully",
    data: result,
  });
});

export const CartControllers = {
  createDataIntoDB,
  getAllDataFromDB,
  getByIdFromDB,
  updateByIdIntoDB,
  deleteByIdFromDB,
};
