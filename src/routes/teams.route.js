import express from "express";
import { body } from "express-validator";
import requsetHandler from "../handlers/request.handler.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import teamsController from "../controllers/teams.controller.js";

const router = express.Router();

router.post(
  "/:competitionId/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("avatarId").notEmpty().withMessage("Avatar id is required"),
    body("characterId").notEmpty().withMessage("Character id is required"),
  ],
  requsetHandler.validate,
  tokenMiddleware.auth,
  teamsController.createTeam
);

router.post(
  "/:competitionId/join",
  [body("code").notEmpty().withMessage("Team Code is required")],
  requsetHandler.validate,
  tokenMiddleware.auth,
  teamsController.joinTeam
);

router.put(
  "/:competitionId/:teamId",
  [body("characterId").notEmpty().withMessage("Character id is required")],
  requsetHandler.validate,
  tokenMiddleware.auth,
  teamsController.chooseCharacter
);

router.get(
  "/:competitionId/:teamId",
  tokenMiddleware.auth,
  teamsController.getTeamDetailById
);

router.put(
  "/:competitionId/:teamId/start",
  tokenMiddleware.auth,
  teamsController.startTeam
);

// router.get("/", tokenMiddleware.auth, teamsController.getAllTeams);

export default router;
