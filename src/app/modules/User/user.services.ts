import { UserRole } from "@prisma/client";
import prisma from "../../../utils/share/prisma";

const createAdmin = async (req: any) => {
  const userData = {
    email: req.body.admin.email,
    password: req.body.password,
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
