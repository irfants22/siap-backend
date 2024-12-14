import { prismaClient } from "../application/db.js";
import { ResponseError } from "../error/response-error.js";
import { getDoctorValidation } from "../validation/doctor-validation.js";
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

const deleteDoctor = async (doctorId) => {
  const doctor = await prismaClient.doctor.findUnique({
    where: {
      id: doctorId,
    },
  });

  if (!doctor) {
    throw new ResponseError(404, "Dokter tidak ditemukan");
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
  deleteDoctor,
};
