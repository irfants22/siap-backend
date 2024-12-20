import fs from "fs";
import cloudinary from "../application/cloudinary.js";
import { prismaClient } from "../application/db.js";
import { ResponseError } from "../error/response-error.js";
import {
  createPolyclinicValidation,
  getPolyclinicValidation,
  updatePolyclinicValidation,
} from "../validation/polyclinic-validation.js";
import { validate } from "../validation/validation.js";

const getAllPolyclinic = async (request) => {
  request = validate(getPolyclinicValidation, request);

  const pageNumber = request.page || 1;
  const limitNumber = request.limit || 10;
  const offset = (pageNumber - 1) * limitNumber;
  const query = request.query;
  const sortBy = request.sortBy || "name";
  const sortOrder = request.sortOrder || "asc";

  const filters = query
    ? { name: { contains: query, mode: "insensitive" } }
    : undefined;

  const polyclinics = await prismaClient.polyclinic.findMany({
    where: filters,
    skip: offset,
    take: limitNumber,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      doctors: true,
    },
  });

  const totalPolyclinics = await prismaClient.polyclinic.count({
    where: filters,
  });

  return {
    data: polyclinics,
    pagination: {
      page: pageNumber,
      total_page: Math.ceil(totalPolyclinics / limitNumber),
      total_polyclinics: totalPolyclinics,
    },
  };
};

const createPolyclinic = async (request, image) => {
  request = validate(createPolyclinicValidation, request);

  let imageUrl = null;
  if (image) {
    const uploadResponse = await cloudinary.uploader.upload(image.path, {
      folder: "polyclinics",
    });
    imageUrl = uploadResponse.secure_url;
    await fs.promises.unlink(image.path);
  }

  const newPolyclinic = await prismaClient.polyclinic.create({
    data: {
      name: request.name,
      image: imageUrl,
    },
  });

  return newPolyclinic;
};

const updatePolyclinic = async (polyclinicId, request, image) => {
  request = validate(updatePolyclinicValidation, request);

  const existingPolyclinic = await prismaClient.polyclinic.findUnique({
    where: {
      id: polyclinicId,
    },
  });

  if (!existingPolyclinic) {
    throw new ResponseError(404, "Poliklinik tidak ditemukan");
  }

  let imageUrl = existingPolyclinic.image;
  if (image) {
    if (existingPolyclinic.image) {
      const publicId = existingPolyclinic.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`polyclinics/${publicId}`);
    }
    const uploadResponse = await cloudinary.uploader.upload(image.path, {
      folder: "polyclinics",
    });
    imageUrl = uploadResponse.secure_url;
    await fs.promises.unlink(image.path);
  }

  const updatedPolyclinic = await prismaClient.polyclinic.update({
    where: {
      id: polyclinicId,
    },
    data: {
      name: request.name,
      image: imageUrl,
    },
  });

  return updatedPolyclinic;
};

const deletePolyclinic = async (polyclinicId) => {
  const polyclinic = await prismaClient.polyclinic.findUnique({
    where: {
      id: polyclinicId,
    },
  });

  if (!polyclinic) {
    throw new ResponseError(404, "Poliklinik tidak ditemukan");
  }

  if (polyclinic.image) {
    const publicId = polyclinic.image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`polyclinics/${publicId}`);
  }

  return prismaClient.polyclinic.delete({
    where: {
      id: polyclinicId,
    },
  });
};

export default {
  getAllPolyclinic,
  createPolyclinic,
  updatePolyclinic,
  deletePolyclinic,
};
