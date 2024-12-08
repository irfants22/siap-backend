import { prismaClient } from "../application/db.js";
import { ResponseError } from "../error/response-error.js";

const getAllDoctor = async () => {
  const doctors = await prismaClient.doctor.findMany({
    include: {
      polyclinic: true,
      queues: true,
    },
  });
  return doctors;
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

export default {
  getAllDoctor,
  getDetailDoctor,
};
