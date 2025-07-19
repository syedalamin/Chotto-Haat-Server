import status from "http-status";
import catchAsync from "../../../utils/share/catchAsync";
import sendResponse from "../../../utils/share/sendResponse";
import { AdminServices } from "./admin.services";
import pick from "../../../utils/search/pick";
import { adminFilterableFields } from "./admin.constants";


const getAllAdmins = catchAsync(async (req, res) => {
 

  const filters = pick(req.query, adminFilterableFields);

  

  const result = await AdminServices.getAllAdmins(filters);

  sendResponse(res, {
    statusCode: status.OK,
    message: "All Admin is retrieved successfully",
    data: result,
  });
});

export const AdminControllers = {
  getAllAdmins,
};
