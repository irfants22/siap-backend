import { Router } from "express";
import userController from "../controller/user-controller.js";

const publicRouter = Router();

publicRouter.get("/", (_req, res) => {
  res.status(200).send("Good, server is running");
});

publicRouter.post("/api/users", userController.register);

export { publicRouter };
