import { getDoc, getDocs, doc, query, where } from "@firebase/firestore";
import { Competitions, Teams } from "../config/config.js";
import { formatDate } from "../helpers/helper.js";

class Team {
  constructor(name, avatarId, competitionId, status, code) {
    this.name = name;
    this.avatarId = avatarId;
    this.competitionId = competitionId;
    this.status = status;
    this.code = code;
    this.totalPoints = 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static async create(name, avatarId, competitionId, status) {
    const code = await this.createTeamCode(competitionId);
    return new Team(name, avatarId, competitionId, status, code);
  }

  static async createTeamCode(competitionId) {
    const competitionDoc = await getDoc(doc(Competitions, competitionId));
    const nameSplit = competitionDoc.data().name.split(" ");
    let baseCode = "";
    // Generate base code from the first character of each word
    nameSplit.forEach((word) => {
      baseCode += word[0].toUpperCase();
    });
    // Attempt to generate a unique team code
    let isCodeUnique = false;
    let attemptCount = 0;
    let teamCode;

    while (!isCodeUnique && attemptCount < 10) {
      const randomCode = Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase();
      teamCode = baseCode + randomCode;
      // Check if the team code is unique
      const teamDoc = await getDocs(
        query(
          Teams,
          where("competitionId", "==", competitionId),
          where("code", "==", teamCode)
        )
      );
      isCodeUnique = teamDoc.empty;
      attemptCount++;
    }
    // If the team code is still not unique after 10 attempts
    if (!isCodeUnique) throw new Error("Failed to generate a unique team code");

    return teamCode;
  }

  async toObject() {
    return {
      name: this.name,
      avatarId: this.avatarId,
      competitionId: this.competitionId,
      status: this.status,
      code: await this.code,
      totalPoints: this.totalPoints,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static toFormattedObject(doc) {
    const data = doc.data();
    const team = new Team(
      data.name,
      data.avatarId,
      data.competitionId,
      data.status,
      data.code
    );
    team.id = doc.id;
    team.totalPoints = data.totalPoints;
    team.createdAt = formatDate(data.createdAt);
    team.updatedAt = formatDate(data.updatedAt);
    return team;
  }
}

export default Team;
