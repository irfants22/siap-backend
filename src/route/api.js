import { Router } from "express";
import { isAuthorized } from "../middleware/auth-middleware.js";
import userController from "../controller/user-controller.js";

const authorizedRouter = Router();
authorizedRouter.use(isAuthorized);

authorizedRouter.get("/api/users/current", userController.getUser);
authorizedRouter.delete("/api/users/logout", userController.logoutUser);

export { authorizedRouter };