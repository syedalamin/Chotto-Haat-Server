import { UserStatus } from "@prisma/client";
import prisma from "../../../utils/share/prisma";
import bcrypt from "bcrypt";
import ApiError from "../../../utils/share/apiError";
import status from "http-status";
import { Token, TTokenPayload } from "../../../utils/authToken/generateToken";
import config from "../../../config";
type TLogin = {
  email: string;
  password: string;
};

const login = async (payload: TLogin) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword: Boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new ApiError(status.NOT_FOUND, "Password Do Not Match");
  }

  const tokenPayload: TTokenPayload = {
    email: userData.email,
    role: userData.role,
  };

  const accessToken = Token.generateToken(
    tokenPayload,
    config.jwt.access_Token as string,
    config.jwt.access_Token_expires_in as string
  );
  const refreshToken = Token.generateToken(
    tokenPayload,
    config.jwt.refresh_Token as string,
    config.jwt.refresh_Token_expires_in as string
  );

  

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

export const AuthServices = {
  login,
};
