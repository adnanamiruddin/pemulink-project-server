import {
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Competitions, TeamMembers, Teams } from "../config/config.js";
import responseHandler from "../handlers/response.handler.js";
import { formatDate } from "../helpers/helper.js";
import Team from "../models/Team.js";
import TeamMember from "../models/TeamMember.js";

const createTeam = async (req, res) => {
  try {
    const { role } = req.user.data;
    if (role !== "user") return responseHandler.forbidden(res);

    const { competitionId } = req.params;
    const competitionDoc = await getDoc(doc(Competitions, competitionId));
    if (!competitionDoc.exists()) return responseHandler.notFound(res);

    const { id } = req.user;
    const { name, avatarId, characterId } = req.body;

    const team = new Team(name, avatarId, competitionId, id);
    const newTeam = await addDoc(Teams, team.toObject());

    const teamMember = new TeamMember(
      newTeam.id,
      id,
      characterId,
      "leader",
      "accepted"
    );
    await addDoc(TeamMembers, teamMember.toObject());

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

    const newTeamMember = new TeamMember(
      teamDoc.id,
      id,
      null,
      "member",
      "pending"
    );
    await addDoc(TeamMembers, newTeamMember.toObject());

    responseHandler.ok(res, { message: "Joined team successfully" });
  } catch (error) {
    responseHandler.error(res);
  }
};

const chooseCharacter = async (req, res) => {
  try {
    const { role } = req.user.data;
    if (role !== "user") return responseHandler.forbidden(res);

    const { competitionId } = req.params;
    const competitionDoc = await getDoc(doc(Competitions, competitionId));
    if (!competitionDoc.exists()) return responseHandler.notFound(res);

    const { teamId } = req.params;
    const teamDoc = await getDoc(doc(Teams, teamId));
    if (!teamDoc.exists()) return responseHandler.notFound(res);

    const { id } = req.user;
    const { characterId } = req.body;

    const teamMemberDoc = await getDoc(
      query(
        TeamMembers,
        where("teamId", "==", teamId),
        where("userId", "==", id),
        where("competitionId", "==", competitionId)
      )
    );
    if (!teamMemberDoc.exists()) return responseHandler.notFound(res);

    const teamMemberRef = doc(TeamMembers, teamMemberDoc.id);
    await updateDoc(teamMemberRef, { characterId, status: "accepted" });

    responseHandler.ok(res, { message: "Character chosen successfully" });
  } catch (error) {
    responseHandler.error(res);
  }
};



// const getAllTeams = async (req, res) => {
//   try {
//     const { competitionId } = req.params;
//     const { role } = req.user.data;
//     if (role !== "super-admin") return responseHandler.forbidden(res);

//     const querySnapshot = await getDocs(
//       query(Teams, where("competitionId", "==", competitionId))
//     );
//     const teams = [];

//     querySnapshot.forEach((doc) => {
//       const teamData = doc.data();
//       const formattedTeam = {
//         id: doc.id,
//         ...teamData,
//         createdAt: formatDate(teamData.createdAt),
//         updatedAt: formatDate(teamData.updatedAt),
//       };
//       teams.push(formattedTeam);
//     });

//     responseHandler.ok(res, teams);
//   } catch (error) {
//     responseHandler.error(res);
//   }
// };

// const getTeamById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { role } = req.user.data;
//     if (role !== "super-admin") return responseHandler.forbidden(res);

//     const teamDoc = await getDoc(doc(Teams, id));
//     if (!teamDoc.exists()) return responseHandler.notFound(res);

//     const teamData = teamDoc.data();
//     const formattedTeam = {
//       id: doc.id,
//       ...teamData,
//       createdAt: formatDate(teamData.createdAt),
//       updatedAt: formatDate(teamData.updatedAt),
//     };

//     responseHandler.ok(res, formattedTeam);
//   } catch (error) {
//     responseHandler.error(res);
//   }
// };

export default {
  createTeam,
  joinTeam,
  chooseCharacter,
  // getAllTeams,
  // getTeamById,
};
