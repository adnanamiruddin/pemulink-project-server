class TeamMember {
  constructor(teamId, userId, role, status) {
    this.teamId = teamId;
    this.userId = userId;
    this.role = role;
    this.status = status;
    this.createdAt = new Date();
  }

  toObject() {
    return {
      teamId: this.teamId,
      userId: this.userId,
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
      data.role,
      data.status
    );
    teamMember.id = doc.id;
    teamMember.createdAt = formatDate(data.createdAt);
    return teamMember;
  }
}
