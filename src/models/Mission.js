import { formatDate } from "../helpers/helper.js";

class Mission {
  constructor(title, description, reward, status) {
    this.title = title;
    this.description = description;
    this.reward = reward;
    this.status = status;
    this.startedAt = null;
    this.endAt = null;
    this.competitionId = null;
    this.createdAt = new Date();
    this.createdBy = null;
    this.updatedAt = new Date();
    this.updatedBy = null;
  }

  toObject() {
    return {
      title: this.title,
      description: this.description,
      reward: this.reward,
      startedAt: this.startedAt,
      endAt: this.endAt,
      status: this.status,
      competitionId: this.competitionId,
      createdAt: this.createdAt,
      createdBy: this.createdBy,
      updatedAt: this.updatedAt,
      updatedBy: this.updatedBy,
    };
  }

  static toFormattedObject(doc) {
    const data = doc.data();
    const mission = new Mission(
      data.title,
      data.description,
      data.reward,
      data.status
    );
    mission.id = doc.id;
    mission.startedAt = data.startedAt;
    mission.endAt = data.endAt;
    mission.competitionId = data.competitionId;
    mission.startedAt =
      data.startedAt !== null ? formatDate(data.startedAt) : null;
    mission.endAt = data.endAt !== null ? formatDate(data.endAt) : null;
    mission.createdAt = formatDate(data.createdAt);
    mission.createdBy = data.createdBy;
    mission.updatedAt = formatDate(data.updatedAt);
    mission.updatedBy = data.updatedBy;
    return mission;
  }
}

export default Mission;
