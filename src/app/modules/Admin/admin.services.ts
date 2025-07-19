import { Prisma } from "@prisma/client";
import prisma from "../../../utils/share/prisma";
import { IAdminFilterRequest } from "./admin.interface";
import { adminSearchAbleFields } from "./admin.constants";

const getAllAdmins = async (filters: IAdminFilterRequest) => {
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
    orderBy: {
      createdAt: "desc",
    },
  });
  return results;
};

export const AdminServices = {
  getAllAdmins,
};
