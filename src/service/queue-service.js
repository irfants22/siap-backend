import { prismaClient } from "../application/db.js";
import { ResponseError } from "../error/response-error.js";
import { getQueueValidation } from "../validation/queue-validation.js";
import { validate } from "../validation/validation.js";

const getAllQueue = async (request) => {
  request = validate(getQueueValidation, request);

  const query = request.query;
  const pageNumber = request.page || 1;
  const limitNumber = request.limit || 10;
  const offset = (pageNumber - 1) * limitNumber;
  const sortBy = request.sortBy || "created_at";
  const sortOrder = request.sortOrder || "asc";
  const status = !request.status
    ? null
    : Array.isArray(request.status)
    ? request.status.map((s) => s.toUpperCase())
    : request.status.toUpperCase();

  const filters = [];

  if (query) {
    filters.push({
      OR: [
        { queue: { contains: query, mode: "insensitive" } },
        { user: { name: { contains: query, mode: "insensitive" } } },
        { doctor: { name: { contains: query, mode: "insensitive" } } },
      ],
    });
  }

  const validStatuses = ["MENUNGGU", "DIPERIKSA", "SELESAI", "TERLEWAT"];
  const statuses = Array.isArray(status)
    ? status.filter((s) => validStatuses.includes(s))
    : status
    ? [status].filter((s) => validStatuses.includes(s))
    : null;

  if (statuses && statuses.length > 0) {
    filters.push({ status: { in: statuses } });
  }

  const queues = await prismaClient.queue.findMany({
    where: {
      AND: [...filters],
    },
    skip: offset,
    take: limitNumber,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      user: true,
      doctor: true,
    },
  });

  const totalQueues = await prismaClient.queue.count({
    where: {
      AND: [...filters],
    },
  });

  return {
    data: queues,
    pagination: {
      page: pageNumber,
      total_page: Math.ceil(totalQueues / limitNumber),
      total_queues: totalQueues,
    },
  };
};

const getDetailQueue = async (queueId) => {
  const queue = await prismaClient.queue.findUnique({
    where: {
      id: queueId,
    },
    include: {
      user: true,
      doctor: true,
    },
  });

  if(!queue) {
    throw new ResponseError(404, "Antrian tidak ditemukan")
  }
  return queue;
}

const updateQueueStatus = async (queueId, status) => {
  const queue = await prismaClient.queue.findUnique({
    where: {
      id: queueId,
    },
  });

  if (!queue) {
    throw new ResponseError(404, "Antrian tidak ditemukan");
  }

  const validTransitions = {
    MENUNGGU: ["DIPERIKSA", "TERLEWAT"],
    DIPERIKSA: ["SELESAI"],
  };

  if (!validTransitions[queue.status]?.includes(status)) {
    throw new ResponseError(404, "Status tidak valid untuk diubah");
  }

  return prismaClient.queue.update({
    where: {
      id: queueId,
    },
    data: {
      status: status,
    },
  });
}

const deleteQueue = async (queueId) => {
  const queue = await prismaClient.queue.findUnique({
    where: {
      id: queueId,
    },
  });

  if (!queue) {
    throw new ResponseError(404, "Antrian tidak ditemukan");
  }

  return prismaClient.queue.delete({
    where: {
      id: queueId,
    },
  });
};

export default {
  getAllQueue,
  getDetailQueue,
  updateQueueStatus,
  deleteQueue,
};
