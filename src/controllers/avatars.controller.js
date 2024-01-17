import { getDocs, query, where } from "firebase/firestore";
import { Avatars, AvatarCharacters } from "../config/config.js";
import responseHandler from "../handlers/response.handler.js";

const getAllAvatars = async (req, res) => {
  try {
    const avatars = [];
    const avatarsSnapshot = await getDocs(Avatars);
    avatarsSnapshot.forEach((doc) => {
      avatars.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    responseHandler.ok(res, avatars);
  } catch (error) {
    responseHandler.error(res);
  }
};

const getAvatarCharactersByAvatarId = async (req, res) => {
  try {
    const { id: avatarId } = req.params;

    const avatarCharacters = [];
    const avatarCharactersSnapshot = await getDocs(
      query(AvatarCharacters, where("avatarId", "==", avatarId))
    );
    avatarCharactersSnapshot.forEach((doc) => {
      avatarCharacters.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    responseHandler.ok(res, avatarCharacters);
  } catch (error) {
    responseHandler.error(res);
  }
};

export default { getAllAvatars, getAvatarCharactersByAvatarId };
