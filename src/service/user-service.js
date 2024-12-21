import fs from "fs";
import cloudinary from "../application/cloudinary.js";
import { prismaClient } from "../application/db.js";
import { ResponseError } from "../error/response-error.js";
import {
  getAllUserValidation,
  loginUserValidation,
  registerUserValidation,
  updateUserValidation,
} from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const register = async (request) => {
  const user = validate(registerUserValidation, request);

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

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);

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

const getUserProfile = async (userId) => {
  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
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

const updateUserProfile = async (userId, request, image) => {
  request = validate(updateUserValidation, request);

  const existingUser = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) {
    throw new ResponseError(404, "Pengguna tidak ditemukan");
  }

  let imageUrl = existingUser.image;
  if (image) {
    if (existingUser.image) {
      const publicId = existingUser.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`users/${publicId}`);
    }
    const uploadResponse = await cloudinary.uploader.upload(image.path, {
      folder: "users",
    });
    imageUrl = uploadResponse.secure_url;
    await fs.promises.unlink(image.path);
  }

  const updatedUser = await prismaClient.user.update({
    where: {
      id: userId,
    },
    data: {
      ...request,
      image: imageUrl,
    },
  });

  return updatedUser;
};

const logoutUser = async (userId) => {
  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ResponseError(404, "Pengguna tidak ditemukan");
  }

  return prismaClient.user.update({
    where: {
      id: userId,
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
  const sortBy = request.sortBy || "name";
  const sortOrder = request.sortOrder || "asc";

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
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      queues: {
        where: {
          isDeleted: false,
        },
      },
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
  getUserProfile,
  updateUserProfile,
  logoutUser,
  getAllUser,
  deleteUser,
};
