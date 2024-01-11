import { Users } from "../config/config.js";
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
    console.log(error);
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
    console.error(error);
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

    if (dataReq.role === "user") dataReq.isMembershipOn = true;

    await updateDoc(docRef, dataReq);

    responseHandler.ok(res, { message: "User updated successfully" });
  } catch (error) {
    console.log(error);
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

// Delay
// const changePassword = async (req, res) => {
//   try {
//     const { newPassword } = req.body;

//     const auth = getAuth();
//     await updatePassword(auth.currentUser, newPassword);

//     responseHandler.ok(res, "Password updated successfully");
//   } catch (error) {
//     console.error(error);
//     responseHandler.error(res);
//   }
// };

export default { signUp, signIn, getProfile, updateProfile, updateUserToAdmin };
