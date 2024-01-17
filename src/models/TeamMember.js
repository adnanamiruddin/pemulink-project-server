import { formatDate } from "../helpers/helper.js";

class TeamMember {
  constructor(teamId, userId, characterId, role, status) {
    this.teamId = teamId;
    this.userId = userId;
    this.characterId = characterId;
    this.role = role;
    this.status = status;
    this.createdAt = new Date();
  }

  toObject() {
    return {
      teamId: this.teamId,
      userId: this.userId,
      characterId: this.characterId,
      role: this.role,
      status: this.status,
      createdAt: this.createdAt,
    };
  }

  static toFormattedObject(doc) {
    const data = doc.data();
    const teamMember = new TeamMember(
      data.teamId,
      data.userId,
      data.characterId,
      data.role,
      data.status
    );
    teamMember.id = doc.id;
    teamMember.createdAt = formatDate(data.createdAt);
    return teamMember;
  }
}

export default TeamMember;
