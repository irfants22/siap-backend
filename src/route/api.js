import { Router } from "express";
import { isAdmin, isAuthorized } from "../middleware/auth-middleware.js";
import userController from "../controller/user-controller.js";
import polyclinicController from "../controller/polyclinic-controller.js";
import doctorController from "../controller/doctor-controller.js";
import queueController from "../controller/queue-controller.js";
import upload from "../middleware/upload.js";

const authorizedRouter = Router();
authorizedRouter.use(isAuthorized);

// User API
authorizedRouter.get("/api/users", isAdmin, userController.getAllUser);
authorizedRouter.get("/api/users/me", userController.getUserProfile);
authorizedRouter.put("/api/users/me", upload.single("image"), userController.updateUserProfile);
authorizedRouter.delete("/api/users/logout", userController.logoutUser);
authorizedRouter.delete("/api/users/:userId", isAdmin, userController.deleteUser);

// Polyclinic API
authorizedRouter.get("/api/polyclinics", polyclinicController.getAllPolyclinic);
authorizedRouter.post("/api/polyclinics", isAdmin, upload.single("image"), polyclinicController.createPolyclinic);
authorizedRouter.put("/api/polyclinics/:polyclinicId", isAdmin, upload.single("image"), polyclinicController.updatePolyclinic);
authorizedRouter.delete("/api/polyclinics/:polyclinicId", isAdmin, polyclinicController.deletePolyclinic);

// Doctor API
authorizedRouter.get("/api/doctors", doctorController.getAllDoctor);
authorizedRouter.post("/api/doctors", isAdmin, upload.single("image"), doctorController.createDoctor);
authorizedRouter.get("/api/doctors/:doctorId", doctorController.getDetailDoctor);
authorizedRouter.put("/api/doctors/:doctorId", isAdmin, upload.single("image"), doctorController.updateDoctor);
authorizedRouter.delete("/api/doctors/:doctorId", isAdmin, doctorController.deleteDoctor);

// Queue API
authorizedRouter.get("/api/queues", isAdmin, queueController.getAllQueue);
authorizedRouter.post("/api/queues", queueController.createQueue);
authorizedRouter.get("/api/queues/me", queueController.getMyQueue);
authorizedRouter.get("/api/queues/:queueId", queueController.getDetailQueue);
authorizedRouter.put("/api/queues/:queueId", queueController.updateQueueStatus);
authorizedRouter.delete("/api/queues/:queueId", queueController.deleteQueue);

export { authorizedRouter };
