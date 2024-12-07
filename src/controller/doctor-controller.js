import doctorService from "../service/doctor-service.js";

const getAllDoctor = async (_req, res, next) => {
  try {
    const result = await doctorService.getAllDoctor();
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllDoctor,
};
