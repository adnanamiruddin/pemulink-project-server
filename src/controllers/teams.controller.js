import {
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Competitions, TeamMembers, Teams, Users } from "../config/config.js";
import responseHandler from "../handlers/response.handler.js";
import Team from "../models/Team.js";
import TeamMember from "../models/TeamMember.js";

const createTeam = async (req, res) => {
  try {
    const { role } = req.user.data;
    if (role !== "user") return responseHandler.forbidden(res);

    const { competitionId } = req.params;
    const competitionDoc = await getDoc(doc(Competitions, competitionId));
    if (!competitionDoc.exists()) return responseHandler.notFound(res);
    if (competitionDoc.data().status !== "started")
      return responseHandler.badRequest(res, "Kompetisi sudah berakhir");

    const { id } = req.user;
    const { name, avatarId, characterId } = req.body;

    const team = await Team.create(name, avatarId, competitionId, "pending");
    const newTeam = await addDoc(Teams, await team.toObject());

    const teamMember = new TeamMember(
      newTeam.id,
      id,
      characterId,
      "leader",
      "accepted"
    );
    const newTeamMember = await addDoc(TeamMembers, teamMember.toObject());

    await updateDoc(doc(Users, id), {
      teamMemberId: newTeamMember.id,
    });

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
    if (competitionDoc.data().status !== "started")
      return responseHandler.badRequest(res, "Kompetisi sudah berakhir");

    const { id } = req.user;
    const { code } = req.body;

    const teamDoc = await getDocs(
      query(
        Teams,
        where("competitionId", "==", competitionId),
        where("code", "==", code)
      )
    );
    if (teamDoc.empty)
      return responseHandler.badRequest(res, "Tim tidak ditemukan");

    // Validate maximum 4 member
    const teamMemberDoc = await getDocs(
      query(TeamMembers, where("teamId", "==", teamDoc.docs[0].id))
    );
    if (teamMemberDoc.size >= 4)
      return responseHandler.badRequest(res, "Tim sudah penuh");

    const teamMember = new TeamMember(
      teamDoc.docs[0].id,
      id,
      null,
      "member",
      "pending"
    );
    const newTeamMember = await addDoc(TeamMembers, teamMember.toObject());

    await updateDoc(doc(Users, id), {
      teamMemberId: newTeamMember.id,
    });

    responseHandler.ok(res, { message: "Joined team successfully" });
  } catch (error) {
    responseHandler.error(res);
  }
};

const chooseCharacter = async (req, res) => {
  try {
    const { role } = req.user.data;
    if (role !== "user") return responseHandler.forbidden(res);

    const { competitionId, teamId } = req.params;
    const competitionDoc = await getDoc(doc(Competitions, competitionId));
    if (!competitionDoc.exists()) return responseHandler.notFound(res);
    if (competitionDoc.data().status !== "started")
      return responseHandler.badRequest(res, "Kompetisi sudah berakhir");

    const teamDoc = await getDoc(doc(Teams, teamId));
    if (!teamDoc.exists()) return responseHandler.notFound(res);

    const { id } = req.user;
    const { characterId } = req.body;

    const teamMemberDoc = await getDocs(
      query(
        TeamMembers,
        where("teamId", "==", teamId),
        where("userId", "==", id)
      )
    );
    if (teamMemberDoc.empty)
      return responseHandler.badRequest(res, "Anda bukan anggota tim ini");

    await updateDoc(doc(TeamMembers, teamMemberDoc.docs[0].id), {
      characterId,
      status: "accepted",
    });

    responseHandler.ok(res, { message: "Character chosen successfully" });
  } catch (error) {
    responseHandler.error(res);
  }
};

const getTeamDetailById = async (req, res) => {
  try {
    const { role } = req.user.data;
    if (role !== "user") return responseHandler.forbidden(res);

    const { competitionId, teamId } = req.params;
    const competitionDoc = await getDoc(doc(Competitions, competitionId));
    if (!competitionDoc.exists()) return responseHandler.notFound(res);

    const teamDoc = await getDoc(doc(Teams, teamId));
    if (!teamDoc.exists()) return responseHandler.notFound(res);
    const team = Team.toFormattedObject(teamDoc);

    const teamMemberDoc = await getDocs(
      query(TeamMembers, where("teamId", "==", teamId))
    );
    const teamMember = [];
    teamMemberDoc.forEach((doc) => {
      teamMember.push(TeamMember.toFormattedObject(doc));
    });

    responseHandler.ok(res, {
      ...team,
      ...teamMember,
    });
  } catch (error) {
    responseHandler.error(res);
  }
};

const startTeam = async (req, res) => {
  try {
    const { role } = req.user.data;
    if (role !== "user") return responseHandler.forbidden(res);

    const { competitionId, teamId } = req.params;

    const competitionDoc = await getDoc(doc(Competitions, competitionId));
    if (!competitionDoc.exists()) return responseHandler.notFound(res);

    const teamDoc = await getDoc(doc(Teams, teamId));
    if (!teamDoc.exists()) return responseHandler.notFound(res);

    if (teamDoc.data().status !== "pending")
      return responseHandler.badRequest(res, "Tim sudah dimulai");

    await updateDoc(doc(Teams, teamId), {
      status: "started",
    });

    responseHandler.ok(res, { message: "Team started successfully" });
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

export default {
  createTeam,
  joinTeam,
  chooseCharacter,
  getTeamDetailById,
  startTeam,
  // getAllTeams,
};
