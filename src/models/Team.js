import { getDoc, query, where } from "@firebase/firestore";
import { Teams } from "../config/config.js";
import { formatDate } from "../helpers/helper.js";

class Team {
  constructor(name, avatarURL, competitionId, members) {
    this.name = name;
    this.avatarURL = avatarURL;
    this.competitionId = competitionId;
    this.code = this.createTeamCode(name, competitionId);
    this.members = [members];
    this.createdAt = new Date();
    this.createdBy = members;
    this.updatedAt = new Date();
    this.updatedBy = members;
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
      avatarURL: this.avatarURL,
      competitionId: this.competitionId,
      code: this.code,
      members: this.members,
      createdAt: this.createdAt,
      createdBy: this.createdBy,
      updatedAt: this.updatedAt,
      updatedBy: this.updatedBy,
    };
  }

  static toFormattedObject(doc) {
    const data = doc.data();
    const team = new Team(
      data.name,
      data.avatarURL,
      data.competitionId,
      data.members
    );
    team.id = doc.id;
    team.createdAt = formatDate(data.createdAt);
    team.createdBy = data.createdBy;
    team.updatedAt = formatDate(data.updatedAt);
    team.updatedBy = data.updatedBy;
    return team;
  }
}

export default Team;
