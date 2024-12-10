import doctorService from "../service/doctor-service.js";

const getAllDoctor = async (req, res, next) => {
  try {
    const request = {
      query: req.query.query,
      page: req.query.page,
      limit: req.query.limit,
    };
    const result = await doctorService.getAllDoctor(request);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getDetailDoctor = async (req, res, next) => {
  try {
    const doctorId = req.params.doctorId;
    const result = await doctorService.getDetailDoctor(doctorId);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDoctor = async (req, res, next) => {
  try {
    const doctorId = req.params.doctorId;
    await doctorService.deleteDoctor(doctorId);
    res.status(200).json({
      status: "OK",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllDoctor,
  getDetailDoctor,
  deleteDoctor,
};
