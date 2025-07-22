import prisma from "../../../utils/share/prisma";
import { IAdminFilterRequest } from "./admin.interface";
import { adminSearchAbleFields } from "./admin.constants";
import { IPaginationOptions } from "../../../interface/pagination";
import {
  allowedAdminSortFields,
  allowedSortOrder,
} from "../../../utils/pagination/pagination";
import { buildSearchAndFilterCondition } from "../../../utils/search/buildSearchAndFilterCondition";
import { buildSortCondition } from "../../../utils/search/buildSortCondition";
import { Admin } from "@prisma/client";
import { Request } from "express";
import ApiError from "../../../utils/share/apiError";
import status from "http-status";
import sendImageToCloudinary from "../../../utils/sendCloudinary";
import { ICloudinaryUploadResponse } from "../../../interface/file";

const getAllAdmins = async (
  filters: IAdminFilterRequest,
  options: IPaginationOptions
) => {
  const { limit, page, skip, sortBy, sortOrder } = buildSortCondition(
    options,
    allowedAdminSortFields,
    allowedSortOrder
  );
  // search

  const whereConditions = buildSearchAndFilterCondition<IAdminFilterRequest>(
    filters,
    adminSearchAbleFields
  );

  // console.log(searchTerm, filterData)
  const results = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const total = await prisma.admin.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: results,
  };
};

const getByIdFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findFirstOrThrow({
    where: {
      id: id,
      isDeleted: false,
    },
  });

  return result;
};

const updateByIdFrmDB = async (id: string, req: Request) => {
  // console.log(id, req.body, req.file);

  const isUserExist = await prisma.admin.findFirstOrThrow({
    where: {
      id: id,
      isDeleted: false,
    },
  });

  if (!isUserExist) {
    throw new ApiError(status.NOT_FOUND, "User is not found");
  }

  if (req.file) {
    const { secure_url } = (await sendImageToCloudinary(
      req.file
    )) as ICloudinaryUploadResponse;
    req.body.profilePhoto = secure_url;
  }

  const result = await prisma.admin.update({
    where: {
      id: id,
    },
    data: req.body,
  });

  return result;
};

export const AdminServices = {
  getAllAdmins,
  getByIdFromDB,
  updateByIdFrmDB,
};
