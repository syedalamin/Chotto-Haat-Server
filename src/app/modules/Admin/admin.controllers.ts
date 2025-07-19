import status from "http-status";
import catchAsync from "../../../utils/share/catchAsync";
import sendResponse from "../../../utils/share/sendResponse";
import { AdminServices } from "./admin.services";
import pick from "../../../utils/search/pick";
import { adminFilterableFields } from "./admin.constants";
import { paginationFilterableField } from "../../../utils/pagination/pagination";

const getAllAdmins = catchAsync(async (req, res) => {
  const filters = pick(req.query, adminFilterableFields);
  const options = pick(req.query, paginationFilterableField);

  const result = await AdminServices.getAllAdmins(filters, options);

  sendResponse(res, {
    statusCode: status.OK,
    message: "All Admin is retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const AdminControllers = {
  getAllAdmins,
};
