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
  "/join",
  [body("code").notEmpty().withMessage("Team Code is required")],
  requsetHandler.validate,
  tokenMiddleware.auth,
  teamsController.joinTeam
);

router.put(
  "/:teamId",
  [body("characterId").notEmpty().withMessage("Character id is required")],
  requsetHandler.validate,
  tokenMiddleware.auth,
  teamsController.chooseCharacter
);

router.get("/:teamId", tokenMiddleware.auth, teamsController.getTeamDetailById);

// router.get("/", tokenMiddleware.auth, teamsController.getAllTeams);

export default router;
