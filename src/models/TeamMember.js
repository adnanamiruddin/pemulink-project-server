class TeamMember {
  constructor(teamId, userId, userAvatarURL, role, status) {
    this.teamId = teamId;
    this.userId = userId;
    this.userAvatarURL = userAvatarURL;
    this.role = role;
    this.status = status;
    this.createdAt = new Date();
  }

  toObject() {
    return {
      teamId: this.teamId,
      userId: this.userId,
      userAvatarURL: this.userAvatarURL,
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
      data.userAvatarURL,
      data.role,
      data.status
    );
    teamMember.id = doc.id;
    teamMember.createdAt = formatDate(data.createdAt);
    return teamMember;
  }
}

export default TeamMember;
