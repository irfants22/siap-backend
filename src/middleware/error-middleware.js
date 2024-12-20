import multer from "multer";
import { ResponseError } from "../error/response-error.js";

const errorMiddleware = async (err, _req, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof multer.MulterError) {
    res
      .status(400)
      .json({
        errors: `Multer error: ${err.message}`,
      })
      .end();
    return;
  }

  if (err instanceof ResponseError) {
    res
      .status(err.status)
      .json({
        errors: err.message,
      })
      .end();
  } else {
    res
      .status(500)
      .json({
        errors: err.message,
      })
      .end();
  }
};

export { errorMiddleware };
