import { prismaClient } from "../application/db.js";
import { ResponseError } from "../error/response-error.js";

const getAllPolyclinic = async () => {
    const polyclinic = await prismaClient.polyclinic.findMany({
        select: {
            id: true,
            name: true,
            image: true,
        },
    });

    return polyclinic;
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