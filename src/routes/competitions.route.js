import express from "express";
import { body } from "express-validator";
import requsetHandler from "../handlers/request.handler.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import competitionsController from "../controllers/competitions.controller.js";
import teamsRoute from "./teams.route.js";

const router = express.Router();

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("subTitle").notEmpty().withMessage("Subtitle is required"),
  ],
  requsetHandler.validate,
  tokenMiddleware.auth,
  competitionsController.createCompetition
);

router.get(
  "/",
  tokenMiddleware.auth,
  competitionsController.getAllCompetitions
);

router.get(
  "/:id",
  tokenMiddleware.auth,
  competitionsController.getCompetitionById
);

router.put(
  "/:id",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("subTitle").notEmpty().withMessage("Subtitle is required"),
    body("status")
      .notEmpty()
      .withMessage("Status is required")
      .isIn(["pending", "started", "ended"])
      .withMessage("Status must be one of pending, active, ended"),
    body("startedAt")
      .notEmpty()
      .withMessage("Started at is required")
      .isDate()
      .withMessage("Started at must be a date"),
    body("endAt")
      .notEmpty()
      .withMessage("End at is required")
      .isDate()
      .withMessage("End at must be a date"),
  ],
  requsetHandler.validate,
  tokenMiddleware.auth,
  competitionsController.updateCompetition
);

router.delete(
  "/:id",
  tokenMiddleware.auth,
  competitionsController.deleteCompetition
);

router.get(
  "/:id/missions",
  tokenMiddleware.auth,
  competitionsController.getAllMissionsByCompetitionId
);

router.put(
  "/:competitionId/mission/:missionId",
  tokenMiddleware.auth,
  competitionsController.addMissionToCompetition
);

router.use("/:competitionId/teams", teamsRoute);

export default router;
