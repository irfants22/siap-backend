import { prismaClient } from "../application/db.js";

const isAuthorized = async (req, res, next) => {
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
        token: token,
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

export default {
  isAuthorized,
};
