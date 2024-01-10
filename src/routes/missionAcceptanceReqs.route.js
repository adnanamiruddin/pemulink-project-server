import express from "express";
import { body } from "express-validator";
import requsetHandler from "../handlers/request.handler.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import missionAcceptanceReqs from "../controllers/missionAcceptanceReqs.controller.js";

const router = express.Router();

router.post(
  // missionId is passed as a parameter
  "/:id",
  [body("photoEvidenceURL").notEmpty().withMessage("Photo evidence is required")],
  tokenMiddleware.auth,
  missionAcceptanceReqs.createMissionAcceptanceReq
);

router.get(
  "/",
  tokenMiddleware.auth,
  missionAcceptanceReqs.getAllMissionAcceptanceReqs
);

router.get(
  "/:id",
  tokenMiddleware.auth,
  missionAcceptanceReqs.getMissionAcceptanceReqById
);

router.put(
  "/:id",
  [
    body("status")
      .notEmpty()
      .withMessage("Status is required")
      .isIn(["approved", "rejected"])
      .withMessage("Invalid status"),
    body("message").notEmpty().withMessage("Message is required"),
  ],
  requsetHandler.validate,
  tokenMiddleware.auth,
  missionAcceptanceReqs.updateMissionAcceptanceReq
);

export default router;
