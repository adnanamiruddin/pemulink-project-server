import {
  AvatarCharacters,
  Avatars,
  Competitions,
  TeamMembers,
  Teams,
  Users,
} from "../config/config.js";
import {
  getDocs,
  doc,
  getDoc,
  query,
  where,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import responseHandler from "../handlers/response.handler.js";
import jsonwebtoken from "jsonwebtoken";
import User from "../models/User.js";
import Team from "../models/Team.js";
import TeamMember from "../models/TeamMember.js";

const signUp = async (req, res) => {
  try {
    const { userUID, firstName, lastName } = req.body;

    const user = new User(userUID, firstName, lastName);
    // Save additional user data
    const docRef = await addDoc(Users, user.toObject());

    user.password = undefined;
    const token = jsonwebtoken.sign(
      { data: docRef.id },
      process.env.SECRET_TOKEN,
      { expiresIn: "24h" }
    );

    responseHandler.created(res, {
      id: docRef.id,
      ...user,
      token,
      message:
        "User added successfully. Please complete your profile information.",
    });
  } catch (error) {
    responseHandler.error(res);
  }
};

const signIn = async (req, res) => {
  try {
    const { userUID } = req.body;

    const querySnapshot = await getDocs(
      query(Users, where("userUID", "==", userUID))
    );
    if (querySnapshot.size === 0) return responseHandler.unauthorize(res);

    const user = querySnapshot.docs[0].data();
    user.password = undefined;
    const token = jsonwebtoken.sign(
      { data: querySnapshot.docs[0].id },
      process.env.SECRET_TOKEN,
      { expiresIn: "24h" }
    );

    responseHandler.created(res, {
      id: querySnapshot.docs[0].id,
      ...user,
      token,
    });
  } catch (error) {
    responseHandler.error(res);
  }
};

const getProfile = async (req, res) => {
  try {
    const docSnap = await getDoc(doc(Users, req.user.id));
    if (!docSnap.exists()) return responseHandler.notFound(res);

    responseHandler.ok(res, User.getProfile(docSnap));
  } catch (error) {
    responseHandler.error(res);
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const dataReq = req.body;

    const docRef = doc(Users, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return responseHandler.notFound(res);

    dataReq.isMembershipOn = true;

    await updateDoc(docRef, dataReq);

    responseHandler.ok(res, { message: "User updated successfully" });
  } catch (error) {
    responseHandler.error(res);
  }
};

const getUserTeam = async (req, res) => {
  try {
    const { role, teamMemberId } = req.user.data;
    if (role !== "user") return responseHandler.forbidden(res);

    const { competitionId } = req.params;
    const competitionDoc = await getDoc(doc(Competitions, competitionId));
    if (!competitionDoc.exists()) return responseHandler.notFound(res);
    if (competitionDoc.data().status !== "started")
      return responseHandler.badRequest(res, "Kompetisi sudah berakhir");

    const teamMemberDoc = await getDoc(doc(TeamMembers, teamMemberId));
    if (!teamMemberDoc.exists()) return responseHandler.notFound(res);

    const teamDoc = await getDoc(doc(Teams, teamMemberDoc.data().teamId));
    if (!teamDoc.exists()) return responseHandler.notFound(res);

    const team = Team.toFormattedObject(teamDoc);
    const avatarDoc = await getDoc(doc(Avatars, team.avatarId));
    const avatarData = avatarDoc.data();
    team.avatarName = avatarData.name;
    team.avatarURL = avatarData.avatarURL;

    const teamMembers = [];
    const querySnapshot = await getDocs(
      query(TeamMembers, where("teamId", "==", teamDoc.id))
    );
    for (const docData of [...querySnapshot.docs].reverse()) {
      const userDoc = await getDoc(doc(Users, docData.data().userId));
      const user = userDoc.data();
      const teamMember = TeamMember.toFormattedObject(docData);
      let characterData = {};
      if (teamMember.characterId) {
        const characterDoc = await getDoc(
          doc(AvatarCharacters, teamMember.characterId)
        );
        characterData = characterDoc.data();
      }
      teamMember.characterName = characterData.name || null;
      teamMember.characterURL = characterData.characterURL || null;
      teamMembers.push({ ...user, ...teamMember });
    }

    responseHandler.ok(res, {
      ...team,
      teamMembers,
    });
  } catch (error) {
    responseHandler.error(res);
  }
};

const updateUserToAdmin = async (req, res) => {
  try {
    const { role } = req.user.data;
    if (role !== "super-admin") return responseHandler.forbidden(res);

    const { id } = req.params;

    const docRef = doc(Users, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return responseHandler.notFound(res);

    await updateDoc(docRef, { role: "admin" });

    responseHandler.ok(res, { message: "User updated successfully" });
  } catch (error) {
    responseHandler.error(res);
  }
};

export default {
  signUp,
  signIn,
  getProfile,
  updateProfile,
  getUserTeam,
  updateUserToAdmin,
};
