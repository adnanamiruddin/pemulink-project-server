import express from "express";
import { body } from "express-validator";
import requsetHandler from "../handlers/request.handler.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import missionsController from "../controllers/missions.controller.js";

const router = express.Router();

router.post(
  "/",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("subTitle").notEmpty().withMessage("Sub title is required"),
  ],
  requsetHandler.validate,
  tokenMiddleware.auth,
  missionsController.createMission
);

router.get("/", tokenMiddleware.auth, missionsController.getAllWeeklyMissions);

router.get("/:id", tokenMiddleware.auth, missionsController.getMissionById);

router.put(
  "/:id",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("pointReward")
      .notEmpty()
      .withMessage("Point reward is required")
      .isInt()
      .withMessage("Point reward must be a number"),
    body("xpReward")
      .notEmpty()
      .withMessage("XP reward is required")
      .isInt()
      .withMessage("XP reward must be a number"),
    body("status")
      .notEmpty()
      .withMessage("Status is required")
      .isIn(["pending", "started", "completed"])
      .withMessage("Invalid status"),
    body("imageURL").optional(),
  ],
  requsetHandler.validate,
  tokenMiddleware.auth,
  missionsController.updateMission
);

router.delete("/:id", tokenMiddleware.auth, missionsController.deleteMission);

export default router;
