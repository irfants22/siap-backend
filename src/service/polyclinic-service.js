import { prismaClient } from "../application/db.js";
import { ResponseError } from "../error/response-error.js";

const getAllPolyclinic = async () => {
  const polyclinics = await prismaClient.polyclinic.findMany({
    include: {
      doctors: true,
    },
  });
  return polyclinics;
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
