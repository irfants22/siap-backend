import fs from "fs";
import cloudinary from "../application/cloudinary.js";
import { prismaClient } from "../application/db.js";
import { ResponseError } from "../error/response-error.js";
import {
  createDoctorValidation,
  getDoctorValidation,
  updateDoctorValidation,
} from "../validation/doctor-validation.js";
import { validate } from "../validation/validation.js";

const getAllDoctor = async (request) => {
  request = validate(getDoctorValidation, request);

  const pageNumber = request.page || 1;
  const limitNumber = request.limit || 10;
  const offset = (pageNumber - 1) * limitNumber;
  const query = request.query;
  const sortBy = request.sortBy || "name";
  const sortOrder = request.sortOrder || "asc";

  const filters = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { phone: { contains: query, mode: "insensitive" } },
        ],
      }
    : undefined;

  const doctors = await prismaClient.doctor.findMany({
    where: filters,
    skip: offset,
    take: limitNumber,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      polyclinic: true,
      queues: {
        where: {
          isDeleted: false,
        },
      },
    },
  });

  const totalDoctors = await prismaClient.doctor.count({
    where: filters,
  });

  return {
    data: doctors,
    pagination: {
      page: pageNumber,
      total_page: Math.ceil(totalDoctors / limitNumber),
      total_doctors: totalDoctors,
    },
  };
};

const getDetailDoctor = async (doctorId) => {
  const doctor = await prismaClient.doctor.findUnique({
    where: {
      id: doctorId,
    },
    include: {
      polyclinic: true,
      queues: true,
    },
  });

  if (!doctor) {
    throw new ResponseError(404, "Dokter tidak ditemukan");
  }

  return doctor;
};

const createDoctor = async (request, image, polyclinic) => {
  request = validate(createDoctorValidation, request);

  if (!polyclinic) {
    throw new ResponseError(400, "polyclinic is required");
  }

  let imageUrl = null;
  if (image) {
    const uploadResponse = await cloudinary.uploader.upload(image.path, {
      folder: "doctors",
    });
    imageUrl = uploadResponse.secure_url;
    await fs.promises.unlink(image.path);
  }

  const polyclinicId = await prismaClient.polyclinic.findFirst({
    where: {
      name: polyclinic,
    },
    select: {
      id: true,
    },
  });

  const newDoctor = await prismaClient.doctor.create({
    data: {
      ...request,
      image: imageUrl,
      polyclinic_id: polyclinicId.id,
    },
  });

  return newDoctor;
};

const updateDoctor = async (doctorId, request, image, polyclinic) => {
  request = validate(updateDoctorValidation, request);

  const existingDoctor = await prismaClient.doctor.findUnique({
    where: {
      id: doctorId,
    },
  });

  if (!existingDoctor) {
    throw new ResponseError(404, "Dokter tidak ditemukan");
  }

  let imageUrl = existingDoctor.image;
  if (image) {
    if (existingDoctor.image) {
      const publicId = existingDoctor.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`doctors/${publicId}`);
    }
    const uploadResponse = await cloudinary.uploader.upload(image.path, {
      folder: "doctors",
    });
    imageUrl = uploadResponse.secure_url;
    await fs.promises.unlink(image.path);
  }

  let polyclinicId = existingDoctor.polyclinic_id;
  if (polyclinic) {
    const foundPolyclinic = await prismaClient.polyclinic.findFirst({
      where: { name: polyclinic },
      select: { id: true },
    });
    if (!foundPolyclinic) {
      throw new ResponseError(404, "Poliklinik tidak ditemukan");
    }
    polyclinicId = foundPolyclinic.id;
  }

  const updatedDoctor = await prismaClient.doctor.update({
    where: {
      id: doctorId,
    },
    data: { image: imageUrl, polyclinic_id: polyclinicId, ...request },
  });

  return updatedDoctor;
};

const deleteDoctor = async (doctorId) => {
  const doctor = await prismaClient.doctor.findUnique({
    where: {
      id: doctorId,
    },
  });

  if (!doctor) {
    throw new ResponseError(404, "Dokter tidak ditemukan");
  }

  if (doctor.image) {
    const publicId = doctor.image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`doctors/${publicId}`);
  }
  return prismaClient.doctor.delete({
    where: {
      id: doctorId,
    },
  });
};

export default {
  getAllDoctor,
  getDetailDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
