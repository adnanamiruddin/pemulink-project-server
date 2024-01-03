import { Users } from "../config/config.js";
import { getDocs, doc, getDoc, query, where, addDoc } from "firebase/firestore";
import bcrypt from "bcrypt";
import responseHandler from "../handlers/response.handler.js";
import jsonwebtoken from "jsonwebtoken";
import User from "../models/User.js";

const isEmailUnique = async (email) => {
  const q = query(Users, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  return querySnapshot.size === 0;
};

const signUp = async (req, res) => {
  try {
    const dataReq = req.body;

    const isUnique = await isEmailUnique(dataReq.email);
    if (!isUnique) return responseHandler.badRequest(res, "Email already used");

    // Hashing password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(dataReq.password, salt);
    dataReq.password = hashedPassword;

    const user = new User(dataReq.email, dataReq.fullName, dataReq.password);

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
    const { email, password } = req.body;

    const q = query(Users, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size === 0)
      return responseHandler.unauthorize(res, "Invalid email or password");

    const user = querySnapshot.docs[0].data();
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid)
      return responseHandler.unauthorize(res, "Invalid email or password");

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

export default { signUp, signIn, getProfile };
