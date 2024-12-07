import { Router } from "express";
import { isAdmin, isAuthorized } from "../middleware/auth-middleware.js";
import userController from "../controller/user-controller.js";

const authorizedRouter = Router();
authorizedRouter.use(isAuthorized);

// User API (patient)
authorizedRouter.get("/api/users/current", userController.getUser);
authorizedRouter.delete("/api/users/logout", userController.logoutUser);

// User API (admin)
authorizedRouter.get("/api/users",  userController.getAllUser);
authorizedRouter.delete("/api/users/:userId", userController.deleteUser);

export { authorizedRouter };
