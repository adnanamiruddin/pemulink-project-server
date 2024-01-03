import express from "express";
import usersController from "../controllers/users.controller.js";
import { body } from "express-validator";
import requsetHandler from "../handlers/request.handler.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

router.post(
  "/sign-up",
  [
    body("email").isEmail().withMessage("Email is invalid"),
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  requsetHandler.validate,
  usersController.signUp
);

router.post(
  "/sign-in",
  [
    body("email").isEmail().withMessage("Email is invalid"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  requsetHandler.validate,
  usersController.signIn
);

router.get("/profile", tokenMiddleware.auth, usersController.getProfile);

router.put(
  "/update-to-admin/:id",
  tokenMiddleware.auth,
  usersController.updateUserToAdmin
);

export default router;
