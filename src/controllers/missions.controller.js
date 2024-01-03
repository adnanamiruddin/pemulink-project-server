import {
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  where,
} from "firebase/firestore";
import { Missions } from "../config/config.js";
import responseHandler from "../handlers/response.handler.js";
import Mission from "../models/Mission.js";

const createMission = async (req, res) => {
  try {
    // Validate if user is admin
    const { role } = req.user.data;
    if (role !== "admin" && role !== "super-admin") {
      return responseHandler.forbidden(res);
    }

    const { id } = req.user;
    const { title } = req.body;

    const mission = new Mission(title);
    mission.createdBy = id;
    mission.updatedBy = id;

    const newMission = await addDoc(Missions, mission.toObject());

    responseHandler.created(res, { id: newMission.id, ...mission });
  } catch (error) {
    responseHandler.error(res);
  }
};

const getAllWeeklyMissions = async (req, res) => {
  try {
    const querySnapshot = await getDocs(
      Missions,
      where("competitionId", "==", null)
    );

    const missions = [];
    querySnapshot.forEach((doc) => {
      missions.push(Mission.toFormattedObject(doc));
    });

    responseHandler.ok(res, missions);
  } catch (error) {
    responseHandler.error(res);
  }
};

const getMissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const docSnap = await getDoc(doc(Missions, id));
    if (!docSnap.exists()) {
      return responseHandler.notFound(res);
    }

    const mission = Mission.toFormattedObject(docSnap);

    responseHandler.ok(res, mission);
  } catch (error) {
    responseHandler.error(res);
  }
};

const updateMission = async (req, res) => {
  try {
    const { role } = req.user.data;
    if (role === "user") return responseHandler.forbidden(res);

    const { id } = req.params;
    const dataReq = req.body;

    const docRef = doc(Missions, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return responseHandler.notFound(res);
    }

    if (dataReq.status === "started") {
      dataReq.startedAt = new Date();
      // endAt date 2 weeks from startedAt date
      const endAt = new Date(dataReq.startedAt);
      endAt.setDate(endAt.getDate() + 14);
      dataReq.endAt = endAt;
    }
    dataReq.updatedAt = new Date();
    dataReq.updatedBy = req.user.id;

    await updateDoc(docRef, dataReq);

    responseHandler.ok(res, dataReq);
  } catch (error) {
    responseHandler.error(res);
  }
};

const deleteMission = async (req, res) => {
  try {
    const { role } = req.user.data;
    if (role !== "admin" && role !== "super-admin") {
      return responseHandler.forbidden(res);
    }

    const { id } = req.params;

    const docRef = doc(Missions, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return responseHandler.notFound(res);
    }

    await deleteDoc(docRef);

    responseHandler.ok(res, { id });
  } catch (error) {
    responseHandler.error(res);
  }
};

export default {
  createMission,
  getAllWeeklyMissions,
  getMissionById,
  updateMission,
  deleteMission,
};
