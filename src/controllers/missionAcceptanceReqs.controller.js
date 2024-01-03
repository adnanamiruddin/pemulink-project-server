import {
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  Missions,
  MissionAcceptanceRequests,
  Users,
} from "../config/config.js";
import responseHandler from "../handlers/response.handler.js";
import MissionAcceptanceReq from "../models/MissionAcceptanceReq.js";

const createMissionAcceptanceReq = async (req, res) => {
  try {
    const { role } = req.user.data;
    if (role !== "user") return responseHandler.forbidden(res);

    const { id: userId } = req.user;
    const { missionId } = req.params;

    const docSnap = await getDoc(doc(Missions, missionId));
    if (!docSnap.exists()) return responseHandler.notFound(res);

    if (docSnap.data().status !== "started")
      return responseHandler.badRequest(res, "Mission is not started");

    const missionAcceptanceReqsnap = await getDocs(
      query(
        MissionAcceptanceRequests,
        where("userId", "==", userId),
        where("missionId", "==", missionId)
      )
    );
    if (!missionAcceptanceReqsnap.empty)
      return responseHandler.badRequest(res, "Mission already requested");

    const missionAcceptanceReq = new MissionAcceptanceReq(userId, missionId);

    await addDoc(MissionAcceptanceRequests, missionAcceptanceReq.toObject());

    responseHandler.created(res, missionAcceptanceReq);
  } catch (error) {
    responseHandler.error(res);
  }
};

const getAllMissionAcceptanceReqs = async (req, res) => {
  try {
    const { role } = req.user.data;
    if (role !== "admin") return responseHandler.forbidden(res);

    const querySnapshot = await getDocs(MissionAcceptanceRequests);
    const missionAcceptanceReqs = [];

    querySnapshot.forEach((doc) => {
      missionAcceptanceReqs.push(MissionAcceptanceReq.toFormattedObject(doc));
    });

    responseHandler.ok(res, missionAcceptanceReqs);
  } catch (error) {
    responseHandler.error(res);
  }
};

const getMissionAcceptanceReqById = async (req, res) => {
  try {
    const { role } = req.user.data;
    if (role !== "admin") return responseHandler.forbidden(res);

    const { id } = req.params;

    const docRef = doc(MissionAcceptanceRequests, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return responseHandler.notFound(res);

    responseHandler.ok(res, MissionAcceptanceReq.toFormattedObject(docSnap));
  } catch (error) {
    responseHandler.error(res);
  }
};

const updateMissionAcceptanceReq = async (req, res) => {
  try {
    const { role } = req.user.data;
    if (role !== "admin") return responseHandler.forbidden(res);

    const { id } = req.params;
    const { status, message } = req.body;

    const docRef = doc(MissionAcceptanceRequests, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return responseHandler.notFound(res);

    const missionAcceptanceReq = docSnap.data();
    if (missionAcceptanceReq.status !== "pending")
      return responseHandler.badRequest(
        res,
        `Mission already ${missionAcceptanceReq.status}`
      );

    missionAcceptanceReq.status = status;
    missionAcceptanceReq.message = message;
    missionAcceptanceReq.updatedAt = new Date();
    missionAcceptanceReq.updatedBy = req.user.id;

    await updateDoc(docRef, missionAcceptanceReq);

    if (status === "approved") {
      const userDocRef = doc(Users, missionAcceptanceReq.userId);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();

      const missionDocSnap = await getDoc(
        doc(Missions, missionAcceptanceReq.missionId)
      );
      const missionData = missionDocSnap.data();

      await updateDoc(userDocRef, {
        xp: userData.xp + missionData.reward,
      });
    }

    responseHandler.ok(res, { message: `Mission ${status}` });
  } catch (error) {
    responseHandler.error(res);
  }
};

export default {
  createMissionAcceptanceReq,
  getAllMissionAcceptanceReqs,
  getMissionAcceptanceReqById,
  updateMissionAcceptanceReq,
};
