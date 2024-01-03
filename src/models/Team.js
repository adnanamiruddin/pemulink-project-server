import { getDoc, query, where } from "@firebase/firestore";
import { Teams } from "../config/config.js";
import { formatDate } from "../helpers/helper.js";

class Team {
  constructor(name, description, status, competitionId, members) {
    this.name = name;
    this.description = description;
    this.status = status;
    this.competitionId = competitionId;
    this.code = this.createTeamCode(name, competitionId);
    this.members = [members];
    this.createdAt = new Date();
    this.createdBy = null;
    this.updatedAt = new Date();
    this.updatedBy = null;
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
        .substring(2, 6)
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

    // If the team code is still not unique after 10 attempts, handle accordingly
    if (!isCodeUnique) {
      // You can throw an error or handle it based on your application's logic
      throw new Error("Failed to generate a unique team code");
    }

    return teamCode;
  }

  toObject() {
    return {
      name: this.name,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt,
      createdBy: this.createdBy,
      updatedAt: this.updatedAt,
      updatedBy: this.updatedBy,
    };
  }

  static toFormattedObject(doc) {
    const data = doc.data();
    const team = new Team(data.name, data.description, data.status);
    team.id = doc.id;
    team.createdAt = formatDate(data.createdAt);
    team.createdBy = data.createdBy;
    team.updatedAt = formatDate(data.updatedAt);
    team.updatedBy = data.updatedBy;
    return team;
  }
}

export default Team;
