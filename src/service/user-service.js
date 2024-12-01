import { prismaClient } from "../application/db.js";
import { ResponseError } from "../error/response-error.js";
import { registerUserValidation } from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";

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

export default {
  register,
};

const login = async () => {};
