import { prismaClient } from "../application/db.js";
import { ResponseError } from "../error/response-error.js";
import {
  deleteQueueValidation,
  getQueueStatusValidation,
  getQueueValidation,
} from "../validation/queue-validation.js";
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
      isDeleted: false,
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
      isDeleted: false,
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

  if (!queue) {
    throw new ResponseError(404, "Antrian tidak ditemukan");
  }
  return queue;
};

const createQueue = async (userId, doctorId) => {
  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ResponseError(404, "Pengguna tidak ditemukan");
  }

  const doctor = await prismaClient.doctor.findUnique({
    where: {
      id: doctorId,
    },
    include: {
      polyclinic: true,
    },
  });

  if (!doctor) {
    throw new ResponseError(404, "Dokter tidak ditemukan");
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const queueCountToday = await prismaClient.queue.count({
    where: {
      doctor_id: doctorId,
      created_at: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  if (queueCountToday >= 30) {
    throw new ResponseError(400, "Batas antrian sudah tercapai");
  }

  const polyclinicCode = doctor.polyclinic.name.slice(0, 2).toUpperCase();

  const lastQueueToday = await prismaClient.queue.findMany({
    where: {
      doctor_id: doctorId,
      created_at: {
        gte: todayStart,
        lt: todayEnd,
      },
    },
    orderBy: { created_at: "desc" },
    take: 1,
  });

  const lastNumber =
    lastQueueToday.length > 0
      ? parseInt(lastQueueToday[0].queue.split("-")[1], 10)
      : 0;

  const newQueueNumber = `${polyclinicCode}-${String(lastNumber + 1).padStart(
    3,
    "0"
  )}`;

  const newQueue = await prismaClient.queue.create({
    data: {
      user_id: userId,
      doctor_id: doctorId,
      queue: newQueueNumber,
      status: "MENUNGGU",
      isViewed: false,
      isDeleted: false,
    },
  });

  return newQueue;
};

const updateQueueStatus = async (queueId, status) => {
  status = validate(getQueueStatusValidation, status);

  const queue = await prismaClient.queue.findUnique({
    where: {
      id: queueId,
    },
  });

  if (!queue) {
    throw new ResponseError(404, "Antrian tidak ditemukan");
  }

  const validStatuses = {
    MENUNGGU: ["DIPERIKSA", "TERLEWAT", "DIBATALKAN"],
    DIPERIKSA: ["SELESAI"],
  };

  if (!validStatuses[queue.status]?.includes(status)) {
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
};

const deleteQueue = async (queueId, destroy) => {
  destroy = validate(deleteQueueValidation, destroy);

  const queue = await prismaClient.queue.findUnique({
    where: {
      id: queueId,
    },
  });

  if (!queue) {
    throw new ResponseError(404, "Antrian tidak ditemukan");
  }

  if (destroy) {
    return prismaClient.queue.delete({
      where: {
        id: queueId,
      },
    });
  } else {
    return prismaClient.queue.update({
      where: {
        id: queueId,
      },
      data: {
        isDeleted: true,
      },
    });
  }
};

export default {
  getAllQueue,
  getDetailQueue,
  createQueue,
  updateQueueStatus,
  deleteQueue,
};
