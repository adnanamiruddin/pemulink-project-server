import express from "express";
import usersRoute from "./users.route.js";
import misssionsRoute from "./missions.route.js";

const router = express.Router();

router.use("/users", usersRoute);
router.use("/missions", misssionsRoute);

export default router;
