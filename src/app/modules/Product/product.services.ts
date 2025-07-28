import { Request } from "express";
import sendImageToCloudinary from "../../../utils/sendCloudinary";
import { ICloudinaryUploadResponse } from "../../../interface/file";
import prisma from "../../../utils/share/prisma";
import ApiError from "../../../utils/share/apiError";
import status from "http-status";
import { generateSlug } from "../../../utils/slug/generateSlug";
import { Product, ProductStatus } from "@prisma/client";

const createDataIntoDB = async (req: Request): Promise<Product> => {
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

  const result = await prisma.product.create({ data: productData });
  return result;
};
const getAllDataFromDB = async (): Promise<Product[]> => {
  const result = await prisma.product.findMany({
    where: {
      status: {
        in: [
          ProductStatus.ACTIVE,
          ProductStatus.DISCONTINUED,
          ProductStatus.OUT_OF_STOCK,
        ],
      },
    },
    include: {
      subCategory: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });
  return result;
};
const getByIdFromDB = async (id: string) => {
  const result = await prisma.product.findFirstOrThrow({
    where: {
      id,
      status: {
        in: [
          ProductStatus.ACTIVE,
          ProductStatus.DISCONTINUED,
          ProductStatus.OUT_OF_STOCK,
        ],
      },
    },

    include: {
      subCategory: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  return result;
};
const updateByIdIntoDB = (id: string, req: Request) => {};
const softDeleteByIdFromDB = async (id: string) => {
  const isProductExists = await prisma.product.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const isStatusDelete =
    isProductExists.status === ProductStatus.ACTIVE
      ? ProductStatus.INACTIVE
      : ProductStatus.ACTIVE;

  const result = await prisma.product.update({
    where: {
      id: isProductExists.id,
    },
    data: {
      status: isStatusDelete,
    },
  });

  return result;
};

export const ProductServices = {
  createDataIntoDB,
  getAllDataFromDB,
  getByIdFromDB,
  updateByIdIntoDB,
  softDeleteByIdFromDB,
};
