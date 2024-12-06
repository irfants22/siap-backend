import { prismaClient } from "../application/db.js";
import { ResponseError } from "../error/response-error.js";
import {
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
    throw new ResponseError(404, "User is not found");
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
    throw new ResponseError(404, "User is not found")
  }

  return prismaClient.user.update({
    where: {
      email: email,
    },
    data: {
      token: null,
    },
    select: {
      email: true,
    },
  });
}

export default {
  register,
  login,
  getUser,
  logoutUser,
};
