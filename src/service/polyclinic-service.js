import { prismaClient } from "../application/db.js";
import { ResponseError } from "../error/response-error.js";
import { getPolyclinicValidation } from "../validation/polyclinic-validation.js";
import { validate } from "../validation/validation.js";

const getAllPolyclinic = async (request) => {
  request = validate(getPolyclinicValidation, request);

  const pageNumber = request.page || 1;
  const limitNumber = request.limit || 10;
  const offset = (pageNumber - 1) * limitNumber;
  const query = request.query;

  const filters = query
    ? { name: { contains: query, mode: "insensitive" } }
    : undefined;

  const polyclinics = await prismaClient.polyclinic.findMany({
    where: filters,
    skip: offset,
    take: limitNumber,
    orderBy: { name: "asc" },
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

const deletePolyclinic = async (polyclinicId) => {
  const polyclinic = await prismaClient.polyclinic.findUnique({
    where: {
      id: polyclinicId,
    },
  });

  if (!polyclinic) {
    throw new ResponseError(404, "Poliklinik tidak ditemukan");
  }

  return prismaClient.polyclinic.delete({
    where: {
      id: polyclinicId,
    },
  });
};

export default {
  getAllPolyclinic,
  deletePolyclinic,
};
