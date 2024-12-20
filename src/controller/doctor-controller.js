import doctorService from "../service/doctor-service.js";

const getAllDoctor = async (req, res, next) => {
  try {
    const request = {
      query: req.query.query,
      page: req.query.page,
      limit: req.query.limit,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
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

const createDoctor = async (req, res, next) => {
  try {
    const request = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      gender: req.body.gender,
      address: req.body.address,
      social_media: req.body.social_media,
      description: req.body.description,
      schedule: req.body.schedule,
    };
    const image = req.file;
    const polyclinic = req.body.polyclinic;
    const result = await doctorService.createDoctor(request, image, polyclinic);
    res.status(201).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateDoctor = async (req, res, next) => {
  try {
    const doctorId = req.params.doctorId;
    const request = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      gender: req.body.gender,
      address: req.body.address,
      social_media: req.body.social_media,
      description: req.body.description,
      schedule: req.body.schedule,
    };
    const image = req.file;
    const polyclinic = req.body.polyclinic;
    const result = await doctorService.updateDoctor(
      doctorId,
      request,
      image,
      polyclinic
    );
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
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
