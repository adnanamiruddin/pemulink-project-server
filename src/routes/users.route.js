import express from "express";
import usersController from "../controllers/users.controller.js";
import { body } from "express-validator";
import requsetHandler from "../handlers/request.handler.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();

router.post(
  "/sign-up",
  [
    body("userUID").notEmpty().withMessage("User UID is required"),
    body("fullName").notEmpty().withMessage("Full name is required"),
  ],
  requsetHandler.validate,
  usersController.signUp
);

// router.post(
//   "/sign-up",
//   [
//     body("email").isEmail().withMessage("Email is invalid"),
//     body("fullName").notEmpty().withMessage("Full name is required"),
//     body("password")
//       .isLength({ min: 8 })
//       .withMessage("Password must be at least 8 characters"),
//     body("confirmPassword")
//       .isLength({ min: 8 })
//       .withMessage("Confirm password must be at least 8 characters")
//       .custom((value, { req }) => {
//         if (value !== req.body.password) {
//           throw new Error("Confirm password does not match password");
//         }
//         return true;
//       }),
//   ],
//   requsetHandler.validate,
//   usersController.signUp
// );

router.post(
  "/sign-in",
  [body("userUID").notEmpty().withMessage("User UID is required")],
  requsetHandler.validate,
  usersController.signIn
);

router.get("/profile", tokenMiddleware.auth, usersController.getProfile);

router.put(
  "/profile",
  tokenMiddleware.auth,
  [
    body("email").isEmail().withMessage("Email is invalid"),
    body("fullName").notEmpty().withMessage("Full name is required"),
    body("age")
      .notEmpty()
      .withMessage("Age is required")
      .isInt()
      .withMessage("Age must be a number"),
    body("city").notEmpty().withMessage("City is required"),
    body("address").notEmpty().withMessage("Address is required"),
    body("phoneNumber")
      .notEmpty()
      .withMessage("Phone number is required")
      .isMobilePhone()
      .withMessage("Phone number is invalid"),
  ],
  requsetHandler.validate,
  usersController.updateProfile
);

router.put(
  "/update-to-admin/:id",
  tokenMiddleware.auth,
  usersController.updateUserToAdmin
);

export default router;
