import express from "express";
import usersRoute from "./users.route.js";
import misssionsRoute from "./missions.route.js";
import missionAcceptanceReqsRoute from "./missionAcceptanceReqs.route.js";
import competitionsRoute from "./competitions.route.js";

const router = express.Router();

router.use("/users", usersRoute);
router.use("/missions", misssionsRoute);
router.use("/mission-acceptance-reqs", missionAcceptanceReqsRoute);
router.use("/competitions", competitionsRoute);

export default router;
