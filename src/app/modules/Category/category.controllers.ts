import status from "http-status";
import catchAsync from "../../../utils/share/catchAsync";
import sendResponse from "../../../utils/share/sendResponse";
import { CategoryServices } from "./category.services";

const createCategoryIntoDB = catchAsync(async (req, res) => {
  const result = await CategoryServices.createCategoryIntoDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "Category is created successfully",
    data: result,
  });
});
const getAllCategoryFromDB = catchAsync(async (req, res) => {
  const result = await CategoryServices.getAllCategoryFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "Category is created successfully",
    data: result,
  });
});
const getByIdFromDB = catchAsync(async (req, res) => {
  const result = await CategoryServices.getByIdFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "Category is created successfully",
    data: result,
  });
});
const updateByIdIntoDB = catchAsync(async (req, res) => {
  const result = await CategoryServices.updateByIdIntoDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "Category is created successfully",
    data: result,
  });
});
const deleteByIdFromDB = catchAsync(async (req, res) => {
  const result = await CategoryServices.deleteByIdFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    message: "Category is created successfully",
    data: result,
  });
});

export const CategoryControllers = {
  createCategoryIntoDB,
  getAllCategoryFromDB,
  getByIdFromDB,
  updateByIdIntoDB,
  deleteByIdFromDB,
};
