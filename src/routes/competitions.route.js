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
    body("description").notEmpty().withMessage("Description is required"),
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
    body("description").notEmpty().withMessage("Description is required"),
    body("status").notEmpty().withMessage("Status is required"),
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

router.put(
  "/:competitionId/mission/:missionId",
  tokenMiddleware.auth,
  competitionsController.addMissionToCompetition
);

router.use("/:competitionId/team", teamsRoute);

export default router;
