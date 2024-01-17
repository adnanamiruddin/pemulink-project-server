import { getDoc, query, where } from "@firebase/firestore";
import { Teams } from "../config/config.js";
import { formatDate } from "../helpers/helper.js";

class Team {
  constructor(name, avatarId, competitionId, leaderId) {
    this.name = name;
    this.avatarId = avatarId;
    this.competitionId = competitionId;
    this.leaderId = leaderId;
    this.code = this.createTeamCode(name, competitionId);
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async createTeamCode(name, competitionId) {
    const nameSplit = name.split(" ");
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
        .substring(2, 3)
        .toUpperCase();
      teamCode = baseCode + randomCode;
      // Check if the team code is unique
      const teamDoc = await getDoc(
        query(
          Teams,
          where("competitionId", "==", competitionId),
          where("teamCode", "==", teamCode)
        )
      );
      if (!teamDoc.exists()) isCodeUnique = true;
      attemptCount++;
    }
    // If the team code is still not unique after 10 attempts
    if (!isCodeUnique) throw new Error("Failed to generate a unique team code");

    return teamCode;
  }

  toObject() {
    return {
      name: this.name,
      avatarId: this.avatarId,
      competitionId: this.competitionId,
      leaderId: this.leaderId,
      code: this.code,
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
      data.leaderId
    );
    team.id = doc.id;
    team.createdAt = formatDate(data.createdAt);
    team.updatedAt = formatDate(data.updatedAt);
    return team;
  }
}

export default Team;
