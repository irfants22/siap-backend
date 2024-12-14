import { Router } from "express";
import { isAdmin, isAuthorized } from "../middleware/auth-middleware.js";
import userController from "../controller/user-controller.js";
import polyclinicController from "../controller/polyclinic-controller.js";
import doctorController from "../controller/doctor-controller.js";
import queueController from "../controller/queue-controller.js";

const authorizedRouter = Router();
authorizedRouter.use(isAuthorized);

// User API (patient)
authorizedRouter.get("/api/users/me", userController.getUser);
authorizedRouter.delete("/api/users/logout", userController.logoutUser);

// User API (admin)
authorizedRouter.get("/api/users",  userController.getAllUser);
authorizedRouter.delete("/api/users/:userId", userController.deleteUser);

// Polyclinic API
authorizedRouter.get("/api/polyclinics", polyclinicController.getAllPolyclinic);
authorizedRouter.delete("/api/polyclinics/:polyclinicId", polyclinicController.deletePolyclinic);

// Doctor API
authorizedRouter.get("/api/doctors", doctorController.getAllDoctor);
authorizedRouter.get("/api/doctors/:doctorId", doctorController.getDetailDoctor);
authorizedRouter.delete("/api/doctors/:doctorId", doctorController.deleteDoctor);

// Queue API
authorizedRouter.get("/api/queues", queueController.getAllQueue);
authorizedRouter.get("/api/queues/:queueId", queueController.getDetailQueue);
authorizedRouter.post("/api/queues", queueController.createQueue);
authorizedRouter.put("/api/queues/:queueId", queueController.updateQueueStatus);
authorizedRouter.delete("/api/queues/:queueId", queueController.deleteQueue);

export { authorizedRouter };
