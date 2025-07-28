import { Request } from "express";
import sendImageToCloudinary from "../../../utils/sendCloudinary";
import { ICloudinaryUploadResponse } from "../../../interface/file";
import prisma from "../../../utils/share/prisma";
import ApiError from "../../../utils/share/apiError";
import status from "http-status";
import { generateSlug } from "../../../utils/slug/generateSlug";

const createDataIntoDB = async (req: Request) => {
  const productData = req.body;
  const isSubCategoryIdExist = await prisma.subCategory.findFirst({
    where: {
      id: productData.subCategoryId,
      isDeleted: false,
    },
  });
  if (!isSubCategoryIdExist) {
    throw new ApiError(status.NOT_FOUND, "Sub Category is Not found");
  }
  const isUserExists = await prisma.user.findUniqueOrThrow({
    where: {
      email: req.user?.email,
    },
  });

  if (isUserExists) {
    productData.sellerId = isUserExists.id;
  }

  if (req.files && Array.isArray(req.files)) {
    const uploadResult = await Promise.all(
      req.files.map((file) => sendImageToCloudinary(file))
    );

    const imageUrl = uploadResult.map(
      (result) => (result as ICloudinaryUploadResponse)?.secure_url
    );
    productData.productImages = imageUrl;
  }

  productData.slug = generateSlug(productData.name);

  const result = await prisma.product.create({data: productData})
  return result
};
const getAllDataFromDB = () => {};
const getByIdFromDB = () => {};
const updateByIdIntoDB = () => {};
const deleteByIdFromDB = () => {};

export const ProductServices = {
  createDataIntoDB,
  getAllDataFromDB,
  getByIdFromDB,
  updateByIdIntoDB,
  deleteByIdFromDB,
};
