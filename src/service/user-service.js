import { prismaClient } from "../application/db.js";
import { ResponseError } from "../error/response-error.js";
import {
  getAllUserValidation,
  getUserValidation,
  loginUserValidation,
  registerUserValidation,
} from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const register = async (req) => {
  const user = validate(registerUserValidation, req);

  const isUserExist = await prismaClient.user.count({
    where: {
      email: user.email,
    },
  });

  if (isUserExist === 1) {
    throw new ResponseError(400, "Pengguna ini sudah terdaftar");
  }

  user.password = await bcrypt.hash(user.password, 10);

  user.is_admin = false;

  return prismaClient.user.create({
    data: user,
    select: {
      name: true,
      email: true,
      phone: true,
      nik: true,
      gender: true,
      address: true,
    },
  });
};

const login = async (req) => {
  const loginRequest = validate(loginUserValidation, req);

  const user = await prismaClient.user.findUnique({
    where: {
      email: loginRequest.email,
    },
    select: {
      email: true,
      password: true,
    },
  });

  if (!user) {
    throw new ResponseError(401, "Email atau Password salah");
  }

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new ResponseError(401, "Email atau password salah");
  }

  const token = uuid().toString();

  return prismaClient.user.update({
    data: {
      token,
    },
    where: {
      email: user.email,
    },
    select: {
      token: true,
    },
  });
};

const getUser = async (email) => {
  email = validate(getUserValidation, email);

  const user = await prismaClient.user.findUnique({
    where: {
      email: email,
    },
    select: {
      name: true,
      email: true,
      phone: true,
      nik: true,
      gender: true,
      address: true,
      image: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, "Pengguna tidak ditemukan");
  }

  return user;
};

const logoutUser = async (email) => {
  email = validate(getUserValidation, email);

  const user = await prismaClient.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ResponseError(404, "Pengguna tidak ditemukan");
  }

  return prismaClient.user.update({
    where: {
      email: email,
    },
    data: {
      token: null,
    },
  });
};

const getAllUser = async (request) => {
  request = validate(getAllUserValidation, request);

  const pageNumber = request.page || 1;
  const limitNumber = request.limit || 10;
  const offset = (pageNumber - 1) * limitNumber;
  const query = request.query;

  const filters = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
          { nik: { contains: query, mode: "insensitive" } },
          { phone: { contains: query, mode: "insensitive" } },
        ],
      }
    : undefined;

  const users = await prismaClient.user.findMany({
    where: filters,
    skip: offset,
    take: limitNumber,
    orderBy: { name: "asc" },
    include: {
      queues: true,
    },
  });

  const totalUsers = await prismaClient.user.count({
    where: filters,
  });

  return {
    data: users,
    pagination: {
      page: pageNumber,
      total_page: Math.ceil(totalUsers / limitNumber),
      total_users: totalUsers,
    },
  };
};

const deleteUser = async (userId) => {
  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ResponseError(404, "Pengguna tidak ditemukan");
  }

  return prismaClient.user.delete({
    where: {
      id: userId,
    },
  });
};

export default {
  register,
  login,
  getUser,
  logoutUser,
  getAllUser,
  deleteUser,
};
