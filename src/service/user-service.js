import { prismaClient } from "../application/db.js";
import { ResponseError } from "../error/response-error.js";
import { loginUserValidation, registerUserValidation } from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const register = async (req) => {
  // validasi skema dari body request
  const user = validate(registerUserValidation, req);

  // validasi user sudah ada atau tidak
  const isUserExist = await prismaClient.user.count({
    where: {
      email: user.email,
    },
  });

  // return error jika pengguna sudah ada / terdaftar
  if (isUserExist === 1) {
    throw new ResponseError(400, "Pengguna ini sudah terdaftar");
  }

  // hashing password
  user.password = await bcrypt.hash(user.password, 10);

  // include role user
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

  if(!user) {
    throw new ResponseError(401, "Email atau Password salah");
  }

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password,
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
      name: true,
      email: true,
      phone: true,
      nik: true,
      gender: true,
      address: true,
      token: true,
      is_admin: true,
    },
  });
};

export default {
  register,
  login
};