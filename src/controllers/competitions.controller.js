import { addDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { Competitions, Missions } from "../config/config.js";
import responseHandler from "../handlers/response.handler.js";
import { formatDate } from "../helper/helper.js";

const createCompetition = async (req, res) => {
  try {
    const { role } = req.user.data;
    if (role !== "super-admin") return responseHandler.forbidden(res);

    const { id } = req.user;
    const dataReq = req.body;

    dataReq.startedAt = null;
    dataReq.endAt = null;
    dataReq.status = "pending";

    dataReq.createdAt = new Date();
    dataReq.createdBy = id;
    dataReq.updatedAt = new Date();
    dataReq.updatedBy = id;

    const newCompetition = await addDoc(Competitions, dataReq);

    responseHandler.created(res, { id: newCompetition.id, ...dataReq });
  } catch (error) {
    responseHandler.error(res);
  }
};

const getAllCompetitions = async (req, res) => {
  try {
    const querySnapshot = await getDocs(Competitions);
    const competitions = [];

    querySnapshot.forEach((doc) => {
      const competitionData = doc.data();
      const formattedCompetition = {
        id: doc.id,
        ...competitionData,
        createdAt: formatDate(competitionData.createdAt),
        updatedAt: formatDate(competitionData.updatedAt),
        startedAt:
          missionData.startedAt !== null
            ? formatDate(missionData.startedAt)
            : null,
        endAt:
          missionData.endAt !== null ? formatDate(missionData.endAt) : null,
      };
      competitions.push(formattedCompetition);
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

    const competitionData = competitionDoc.data();
    const formattedCompetition = {
      id: competitionDoc.id,
      ...competitionData,
      createdAt: formatDate(competitionData.createdAt),
      updatedAt: formatDate(competitionData.updatedAt),
      startedAt:
        missionData.startedAt !== null
          ? formatDate(missionData.startedAt)
          : null,
      endAt: missionData.endAt !== null ? formatDate(missionData.endAt) : null,
    };

    responseHandler.ok(res, formattedCompetition);
  } catch (error) {
    responseHandler.error(res);
  }
};

const updateCompetition = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user.data;
    if (role !== "super-admin") return responseHandler.forbidden(res);

    const dataReq = req.body;
    dataReq.updatedAt = new Date();

    const competitionDoc = await getDoc(doc(Competitions, id));
    if (!competitionDoc.exists()) return responseHandler.notFound(res);

    await updateDoc(doc(Competitions, id), dataReq);

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
};
