
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

  const whereConditions = buildSearchAndFilterCondition<IAdminFilterRequest>(filters, adminSearchAbleFields);

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
