import { Prisma } from "@prisma/client";
import prisma from "../../../utils/share/prisma";
import { IAdminFilterRequest } from "./admin.interface";
import { adminSearchAbleFields } from "./admin.constants";
import { IPaginationOptions } from "../../../interface/pagination";

const getAllAdmins = async (
  filters: IAdminFilterRequest,
  options: IPaginationOptions
) => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 2;
  const skip: number = (page - 1) * limit;

  const sortBy: string = options.sortBy || "createdAt";
  const sortOrder: string = options.sortOrder || "desc";

  // search
  const { searchTerm, ...filterData } = filters;
  const andConditions: Prisma.AdminWhereInput[] = [];

  // searchTerm
  if (searchTerm) {
    andConditions.push({
      OR: adminSearchAbleFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  // filter
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.entries(filterData).map(([key, value]) => ({
        [key]: {
          equals: value,
          mode: "insensitive",
        },
      })),
    });
  }
  // soft delete

  andConditions.push({
    isDeleted: false,
  });
  const whereConditions: Prisma.AdminWhereInput = {
    AND: andConditions,
  };

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

export const AdminServices = {
  getAllAdmins,
};
