import { Admin, UserRole } from "@prisma/client";
import prisma from "../../../utils/share/prisma";
import bcrypt from "bcrypt";
import sendImageToCloudinary from "../../../utils/sendCloudinary";
import { ICloudinaryUploadResponse } from "../../../interface/file";
import { Request } from "express";
import status from "http-status";
import ApiError from "../../../utils/share/apiError";

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

export const UserServices = {
  createAdmin,
};
