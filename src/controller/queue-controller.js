import queueService from "../service/queue-service.js";

const getAllQueue = async (req, res, next) => {
  try {
    const request = {
      query: req.query.query,
      page: req.query.page,
      limit: req.query.limit,
      status: req.query.status,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    };
    const result = await queueService.getAllQueue(request);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllQueue,
};
