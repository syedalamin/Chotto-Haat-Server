import { Request } from "express";
import prisma from "../../../utils/share/prisma";
import ApiError from "../../../utils/share/apiError";
import status from "http-status";
import sendImageToCloudinary from "../../../utils/sendCloudinary";
import { ICloudinaryUploadResponse } from "../../../interface/file";
import { generateSlug } from "../../../utils/slug/generateSlug";
import { Prisma } from "@prisma/client";

const createCategoryIntoDB = async (req: Request) => {
  const name = req.body.name;
  const isExistsName = await prisma.category.findFirst({
    where: {
      name: name,
      isDeleted: false,
    },
  });

  if (isExistsName) {
    throw new ApiError(status.FOUND, "Category is already exists");
  }

  if (req.file) {
    const { secure_url } = (await sendImageToCloudinary(
      req.file
    )) as ICloudinaryUploadResponse;

    req.body.image = secure_url;
  }

  if (!req.body.image) {
    throw new ApiError(status.NOT_FOUND, "Upload a category picture");
  }
  const slug = generateSlug(name);

  const categoryData = {
    name,
    slug,
    image: req.body.image,
  };

  const result = await prisma.category.create({ data: categoryData });

  return result;
};
const getAllCategoryFromDB = async () => {
  const result = await prisma.category.findMany({});
  return result;
};
const getByIdFromDB = async (id: string) => {
  const result = await prisma.category.findFirstOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  return result;
};
const updateByIdIntoDB = async (req: Request, id: string) => {
  const name = req.body.name;

  if (name) {
    const isExistsName = await prisma.category.findFirst({
      where: {
        name: name,
        isDeleted: false,
      },
    });

    if (isExistsName) {
      throw new ApiError(status.CONFLICT, "Category is already exists");
    }
  }

  const isExistsCategory = await prisma.category.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!isExistsCategory) {
    throw new ApiError(status.NOT_FOUND, "Category is not found");
  }

  if (req.file) {
    const { secure_url } = (await sendImageToCloudinary(
      req.file
    )) as ICloudinaryUploadResponse;

    req.body.image = secure_url;
  }

  const categoryData: Prisma.CategoryUpdateInput = {};
  if (name) {
    categoryData.name = name;
    categoryData.slug = generateSlug(name);
  } else if (req.body) {
    categoryData.isDeleted = req.body.isDeleted;
  } else if (req.body.image) {
    categoryData.image = req.body.image;
  }

  const result = await prisma.category.update({
    where: {
      id: isExistsCategory.id,
    },
    data: categoryData,
  });

  return result;
};
const deleteByIdFromDB = async (id: string) => {
  const isExistsCategory = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  if (!isExistsCategory) {
    throw new ApiError(status.NOT_FOUND, "Category is not found");
  }

  const result = await prisma.category.delete({
    where: {
      id: isExistsCategory.id,
    },
  });

  return result;
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoryFromDB,
  getByIdFromDB,
  updateByIdIntoDB,
  deleteByIdFromDB,
};
