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

const getDetailQueue = async (req, res, next) => {
  try {
    const queueId = req.params.queueId;
    const result = await queueService.getDetailQueue(queueId);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const createQueue = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const doctorId = req.body.doctorId;
    const result = await queueService.createQueue(userId, doctorId);
    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateQueueStatus = async (req, res, next) => {
  try {
    const queueId = req.params.queueId;
    const { status } = req.body;
    await queueService.updateQueueStatus(queueId, status);
    res.status(200).json({
      status: "OK",
    });
  } catch (error) {
    next(error);
  }
};

const deleteQueue = async (req, res, next) => {
  try {
    const queueId = req.params.queueId;
    const { destroy } = req.body;
    await queueService.deleteQueue(queueId, destroy);
    res.status(200).json({
      status: "OK",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllQueue,
  getDetailQueue,
  createQueue,
  updateQueueStatus,
  deleteQueue,
};
