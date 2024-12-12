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
    res.status(200).json ({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateQueueStatus = async (req, res, next) => {
  try {
    const queueId = req.params.queueId;
    const {status} = req.body;
    await queueService.updateQueueStatus(queueId, status);
    res.status(200).json({
      status: "OK",
    });
  } catch (error) {
    next(error);
  }
}

const deleteQueue = async (req, res, next) => {
  try {
    const queueId = req.params.queueId;
    await queueService.deleteQueue(queueId);
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
  updateQueueStatus,
  deleteQueue,
};
