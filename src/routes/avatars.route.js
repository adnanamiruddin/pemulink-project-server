import express from "express";
import tokenMiddleware from "../middlewares/token.middleware.js";
import avatarsController from "../controllers/avatars.controller.js";

const router = express.Router();

router.get("/", tokenMiddleware.auth, avatarsController.getAllAvatars);

router.get(
  "/:id",
  tokenMiddleware.auth,
  avatarsController.getAvatarCharactersByAvatarId
);

export default router;
