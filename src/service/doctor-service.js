import { prismaClient } from "../application/db.js";

const getAllDoctor = async () => {
  const doctors = await prismaClient.doctor.findMany({
    include: {
      polyclinic: true,
      queues: true,
    },
  });
  return doctors;
};

export default {
  getAllDoctor,
};
