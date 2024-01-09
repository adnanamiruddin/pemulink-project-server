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
import { formatDate } from "../helpers/helper.js";
import Team from "../models/Team.js";

const createTeam = async (req, res) => {
  try {
    const { role } = req.user.data;
    if (role !== "user") return responseHandler.forbidden(res);

    const { competitionId } = req.params;
    const competitionDoc = await getDoc(doc(Competitions, competitionId));
    if (!competitionDoc.exists()) return responseHandler.notFound(res);

    const { id } = req.user;
    const { name, description } = req.body;

    const team = new Team(name, description, competitionId, id);

    const newTeam = await addDoc(Teams, team.toObject());

    responseHandler.created(res, {
      id: newTeam.id,
      ...team,
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

    const { competitionId } = req.params;
    const competitionDoc = await getDoc(doc(Competitions, competitionId));
    if (!competitionDoc.exists()) return responseHandler.notFound(res);

    const { id } = req.user;
    const { code } = req.body;

    const teamDoc = await getDoc(
      query(
        Teams,
        where("competitionId", "==", competitionId),
        where("code", "==", code)
      )
    );
    if (!teamDoc.exists()) return responseHandler.notFound(res);

    await updateDoc(doc(Teams, teamDoc.id), {
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
