import { prismaClient } from "../application/db.js";

export const isAuthorized = async (req, res, next) => {
  const token = req.get("Authorization");

  if (!token) {
    res
      .status(401)
      .json({
        errors: "Unauthorized",
      })
      .end();
  } else {
    const user = await prismaClient.user.findFirst({
      where: {
        token,
      },
    });

    if (!user) {
      res
        .status(401)
        .json({
          errors: "Unauthorized",
        })
        .end();
    } else {
      req.user = user;
      next();
    }
  }
};

export const isAdmin = async (req, res, next) => {
  const { is_admin } = req.user;

  if (!is_admin) {
    res
      .status(403)
      .json({
        errors: "Anda tidak memiliki akses",
      })
      .end();
  } else {
    next();
  }
};
