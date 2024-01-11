import { initializeApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import "dotenv/config";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export collections/tables
export const Users = collection(db, "users");
export const Missions = collection(db, "missions");
export const MissionAcceptanceRequests = collection(
  db,
  "mission_acceptance_requests"
);
export const Competitions = collection(db, "competitions");
export const Teams = collection(db, "teams");

// export const TeamMembers = collection(db, "team_members");
// export const WasteBanks = collection(db, "waste_banks");
