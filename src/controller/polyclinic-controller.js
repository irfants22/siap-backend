import polyclinicService from "../service/polyclinic-service.js";

const getAllPolyclinic = async (req, res, next) => {
  try {
    const request = {
      query: req.query.query,
      page: req.query.page,
      limit: req.query.limit,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    };
    const result = await polyclinicService.getAllPolyclinic(request);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const createPolyclinic = async (req, res, next) => {
  try {
    const request =  {
      name: req.body.name,
    };
    const image = req.file;
    const result = await polyclinicService.createPolyclinic(request, image);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error)
  }
};

const updatePolyclinic = async (req, res, next) => {
  try {
    const polyclinicId = req.params.polyclinicId;
    const request = {
      name: req.body.name,
    };
    const image = req.file;
    const result = await polyclinicService.updatePolyclinic(
      polyclinicId,
      request,
      image,
    );
    res.status(200).json({
      data: result,
    })
  } catch (error) {
    next(error);
  }
}

const deletePolyclinic = async (req, res, next) => {
  try {
    const polyclinicId = req.params.polyclinicId;
    await polyclinicService.deletePolyclinic(polyclinicId);
    res.status(200).json({
      status: "OK",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllPolyclinic,
  createPolyclinic,
  updatePolyclinic,
  deletePolyclinic,
};
