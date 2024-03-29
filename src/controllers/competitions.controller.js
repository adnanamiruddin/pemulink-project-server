import {
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Competitions, Missions } from "../config/config.js";
import responseHandler from "../handlers/response.handler.js";
import Competition from "../models/Competition.js";
import Mission from "../models/Mission.js";

const createCompetition = async (req, res) => {
  try {
    const { role } = req.user.data;
    if (role !== "super-admin") return responseHandler.forbidden(res);

    const { id } = req.user;
    const { name, subTitle } = req.body;

    const competition = new Competition(name, subTitle, "pending");
    competition.createdBy = id;
    competition.updatedBy = id;

    const newCompetition = await addDoc(Competitions, competition.toObject());

    responseHandler.created(res, { id: newCompetition.id, ...competition });
  } catch (error) {
    responseHandler.error(res);
  }
};

const getAllCompetitions = async (req, res) => {
  try {
    const querySnapshot = await getDocs(Competitions);
    const competitions = [];

    querySnapshot.forEach((doc) => {
      competitions.push(Competition.toFormattedObject(doc));
    });

    responseHandler.ok(res, competitions);
  } catch (error) {
    responseHandler.error(res);
  }
};

const getCompetitionById = async (req, res) => {
  try {
    const { id } = req.params;

    const competitionDoc = await getDoc(doc(Competitions, id));
    if (!competitionDoc.exists()) return responseHandler.notFound(res);

    responseHandler.ok(res, Competition.toFormattedObject(competitionDoc));
  } catch (error) {
    responseHandler.error(res);
  }
};

const updateCompetition = async (req, res) => {
  try {
    const { role } = req.user.data;
    if (role !== "super-admin") return responseHandler.forbidden(res);

    const { id } = req.params;
    const dataReq = req.body;

    const competitionRef = doc(Competitions, id);
    const competitionDoc = await getDoc(competitionRef);
    if (!competitionDoc.exists()) return responseHandler.notFound(res);

    dataReq.updatedAt = new Date();

    await updateDoc(competitionRef, dataReq);

    responseHandler.ok(res, { id, ...dataReq });
  } catch (error) {
    responseHandler.error(res);
  }
};

const deleteCompetition = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user.data;
    if (role !== "super-admin") return responseHandler.forbidden(res);

    const competitionDoc = await getDoc(doc(Competitions, id));
    if (!competitionDoc.exists()) return responseHandler.notFound(res);

    await updateDoc(doc(Competitions, id), { status: "deleted" });

    responseHandler.ok(res);
  } catch (error) {
    responseHandler.error(res);
  }
};

const getAllMissionsByCompetitionId = async (req, res) => {
  try {
    const { id } = req.params;

    const competitionDoc = await getDoc(doc(Competitions, id));
    if (!competitionDoc.exists()) return responseHandler.notFound(res);

    const querySnapshot = await getDocs(
      query(Missions, where("competitionId", "==", id))
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

const addMissionToCompetition = async (req, res) => {
  try {
    const { role } = req.user.data;
    if (role !== "super-admin") return responseHandler.forbidden(res);

    const { competitionId, missionId } = req.params;

    const competitionDoc = await getDoc(doc(Competitions, id));
    if (!competitionDoc.exists()) return responseHandler.notFound(res);

    const missionDoc = await getDoc(doc(Missions, missionId));
    if (!missionDoc.exists()) return responseHandler.notFound(res);

    await updateDoc(doc(Missions, missionId), {
      competitionId,
    });
    // await updateDoc(doc(Competitions, id), {
    //   missions: [...competitionDoc.data().missions, missionId],
    // });

    responseHandler.ok(res, { message: "Mission added to competition" });
  } catch (error) {
    responseHandler.error(res);
  }
};

export default {
  createCompetition,
  getAllCompetitions,
  getCompetitionById,
  updateCompetition,
  deleteCompetition,
  addMissionToCompetition,
  getAllMissionsByCompetitionId,
};
