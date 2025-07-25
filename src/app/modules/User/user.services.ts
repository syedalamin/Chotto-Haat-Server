import { Admin, User, UserRole, UserStatus } from "@prisma/client";
import prisma from "../../../utils/share/prisma";
import bcrypt from "bcrypt";
import sendImageToCloudinary from "../../../utils/sendCloudinary";
import { ICloudinaryUploadResponse } from "../../../interface/file";
import { Request } from "express";
import status from "http-status";
import ApiError from "../../../utils/share/apiError";
import { IUserFilterRequest } from "./user.interface";
import { buildSearchAndFilterCondition } from "../../../utils/search/buildSearchAndFilterCondition";
import { userSearchAbleFields } from "./user.constants";
import { IPaginationOptions } from "../../../interface/pagination";
import { buildSortCondition } from "../../../utils/search/buildSortCondition";
import {
  allowedSortOrder,
  allowedUserSortFields,
} from "../../../utils/pagination/pagination";
import { JwtPayload } from "jsonwebtoken";

const createAdmin = async (req: Request): Promise<Admin> => {
  const isUserExist = await prisma.admin.findFirst({
    where: {
      email: req.body.admin.email,
    },
  });

  if (isUserExist) {
    throw new ApiError(status.CONFLICT, "User is already exists");
  }

  if (req.file) {
    const { secure_url } = (await sendImageToCloudinary(
      req.file
    )) as ICloudinaryUploadResponse;
    req.body.admin.profilePhoto = secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });
    const createdAdminData = await transactionClient.admin.create({
      data: req.body.admin,
    });

    return createdAdminData;
  });

  return result;
};

const createCustomer = async (req: Request) => {
  const isUserExist = await prisma.customer.findFirst({
    where: {
      email: req.body.customer.email,
    },
  });

  if (req.file) {
    const { secure_url } = (await sendImageToCloudinary(
      req.file
    )) as ICloudinaryUploadResponse;
    req.body.customer.profilePhoto = secure_url;
  }

  if (isUserExist) {
    throw new ApiError(status.CONFLICT, "Customer is Already Exists");
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const userData = {
    email: req.body.customer.email,
    password: hashedPassword,
    role: UserRole.CUSTOMER,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdCustomerData = await transactionClient.customer.create({
      data: req.body.customer,
    });

    return createdCustomerData;
  });

  return result;
};

const getAllUserFromDB = async (
  filters: IUserFilterRequest,
  options: IPaginationOptions
) => {
  const { limit, page, skip, sortBy, sortOrder } = buildSortCondition(
    options,
    allowedUserSortFields,
    allowedSortOrder
  );

  // search

  const whereConditions = buildSearchAndFilterCondition<IUserFilterRequest>(
    filters,
    userSearchAbleFields
  );

  const result = await prisma.user.findMany({
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

  const total = await prisma.user.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<User | null> => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
  });

  return result;
};

const getMyProfile = async (user?: JwtPayload) => {
  const userInfo = await prisma.user.findFirstOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });

  let profileInfo;

  if (userInfo.role == UserRole.ADMIN) {
    profileInfo = await prisma.admin.findUniqueOrThrow({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role == UserRole.CUSTOMER) {
    profileInfo = await prisma.customer.findUniqueOrThrow({
      where: {
        email: userInfo.email,
      },
    });
  }

  return { ...userInfo, ...profileInfo };
};

const updateMyProfile = async (req: Request, user?: JwtPayload) => {
  const userInfo = await prisma.user.findFirstOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
    },
  });

  if (!userInfo) {
    throw new ApiError(status.NOT_FOUND, "User is not found");
  }

  let updatedData = { ...req.body };

  if (req.file) {
    const { secure_url } = (await sendImageToCloudinary(
      req.file
    )) as ICloudinaryUploadResponse;
    updatedData.profilePhoto = secure_url;
  }

  let profileInfo;
  if (userInfo.role == UserRole.ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: updatedData,
    });
  } else if (userInfo.role == UserRole.CUSTOMER) {
    profileInfo = await prisma.customer.update({
      where: {
        email: userInfo.email,
      },
      data: updatedData,
    });
  }

  return { ...userInfo, ...profileInfo };
};

const changeUserStatus = async (email: string) => {
  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      status: true,
      role: true,
      admin: { select: { isDeleted: true } },
      customer: { select: { isDeleted: true } },
    },
  });

  if (!isUserExist) {
    throw new ApiError(status.NOT_FOUND, "User is not found");
  }

  const newStatus = isUserExist.status == "ACTIVE" ? "BLOCKED" : "ACTIVE";
  const newAdminIsDeleted = isUserExist.admin?.isDeleted ? false : true;
  const newCustomerIsDeleted = isUserExist.customer?.isDeleted ? false : true;

  const result = await prisma.$transaction(async (transactionClient) => {
    const changeUserStatus = await transactionClient.user.update({
      where: {
        email: isUserExist.email,
      },
      data: {
        status: newStatus,
      },
      select: {
        email: true,
        status: true,
      },
    });

    let changeIsDeleted;
    if (isUserExist.role == "ADMIN") {
      changeIsDeleted = await transactionClient.admin.update({
        where: {
          email: isUserExist.email,
        },
        data: {
          isDeleted: newAdminIsDeleted,
        },
        select: {
          isDeleted: true,
        },
      });
    } else if (isUserExist.role == "CUSTOMER") {
      changeIsDeleted = await transactionClient.customer.update({
        where: {
          email: isUserExist.email,
        },
        data: {
          isDeleted: newCustomerIsDeleted,
        },
        select: {
          isDeleted: true,
        },
      });
    }

    return { ...changeUserStatus, ...changeIsDeleted };
  });

  return result;
};
const updateUserRole = async (email: string, payload: { role: UserRole }) => {
  const isUserExist = await prisma.user.findFirstOrThrow({
    where: {
      email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });

  const updatedUserRole = await prisma.user.update({
    where: {
      email: isUserExist.email,
    },
    data: payload,
    select: {
      email: true,
      password: true,
      role: true,
      needPasswordChange: true,
      status: true,
    },
  });

  return updatedUserRole;
};

export const UserServices = {
  createAdmin,
  createCustomer,
  getAllUserFromDB,
  getByIdFromDB,
  getMyProfile,
  updateMyProfile,
  changeUserStatus,
  updateUserRole,
};
