import {
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Competitions, Teams } from "../config/config.js";
import responseHandler from "../handlers/response.handler.js";
import { formatDate } from "../helper/helper.js";

const createTeam = async (req, res) => {
  try {
    const { role } = req.user.data;
    if (role !== "user") return responseHandler.forbidden(res);

    const { id } = req.user;
    const dataReq = req.body;

    const { competitionId } = req.params;
    const competitionDoc = await getDoc(doc(Competitions, competitionId));
    if (!competitionDoc.exists()) return responseHandler.notFound(res);

    // Get the first 3 characters of the competition name
    const competitionName = competitionDoc.data().name;
    const competitionCode =
      competitionName.slice(0, 1) +
      competitionName.charAt(Math.floor(competitionName.length / 2)) +
      competitionName.slice(-1);
    // Create 4 characters in the form of uppercase letters and a unique random number
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();

    const teamCode = competitionCode + randomCode;

    // Validate teamCode must unique
    const teamDoc = await getDoc(
      query(Teams, where("competitionId", "==", competitionId))
    );
    if (teamDoc.exists())
      return responseHandler.badRequest(
        res,
        "Team already exists. Please try again"
      );

    dataReq.code = teamCode;
    dataReq.members = [id];
    dataReq.competitionId = competitionId;

    dataReq.createdAt = new Date();
    dataReq.createdBy = id;
    dataReq.updatedAt = new Date();
    dataReq.updatedBy = id;

    const newTeam = await addDoc(Teams, dataReq);

    responseHandler.created(res, {
      id: newTeam.id,
      ...dataReq,
      message: "Team created successfully",
    });
  } catch (error) {
    responseHandler.error(res);
  }
};

const joinTeam = async (req, res) => {
  try {
    const { role } = req.user.data;
    if (role !== "user") return responseHandler.forbidden(res);

    const { id } = req.user;

    const { competitionId } = req.params;
    const { code } = req.body;
    const teamDoc = await getDoc(
      query(
        Teams,
        where("competitionId", "==", competitionId),
        where("code", "==", code)
      )
    );
    if (!teamDoc.exists()) return responseHandler.notFound(res);

    await updateDoc(doc(Teams, teamId), {
      members: [...teamDoc.data().members, id],
    });

    responseHandler.ok(res, { message: "Joined team successfully" });
  } catch (error) {
    responseHandler.error(res);
  }
};

const getAllTeams = async (req, res) => {
  try {
    const { competitionId } = req.params;
    const { role } = req.user.data;
    if (role !== "super-admin") return responseHandler.forbidden(res);

    const querySnapshot = await getDocs(
      query(Teams, where("competitionId", "==", competitionId))
    );
    const teams = [];

    querySnapshot.forEach((doc) => {
      const teamData = doc.data();
      const formattedTeam = {
        id: doc.id,
        ...teamData,
        createdAt: formatDate(teamData.createdAt),
        updatedAt: formatDate(teamData.updatedAt),
      };
      teams.push(formattedTeam);
    });

    responseHandler.ok(res, teams);
  } catch (error) {
    responseHandler.error(res);
  }
};

const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user.data;
    if (role !== "super-admin") return responseHandler.forbidden(res);

    const teamDoc = await getDoc(doc(Teams, id));
    if (!teamDoc.exists()) return responseHandler.notFound(res);

    const teamData = teamDoc.data();
    const formattedTeam = {
      id: doc.id,
      ...teamData,
      createdAt: formatDate(teamData.createdAt),
      updatedAt: formatDate(teamData.updatedAt),
    };

    responseHandler.ok(res, formattedTeam);
  } catch (error) {
    responseHandler.error(res);
  }
};

export default {
  createTeam,
  joinTeam,
  getAllTeams,
  getTeamById,
};
