import { formatDate } from "../helpers/helper.js";

class Mission {
  constructor(title, description, pointReward, xpReward, status) {
    this.title = title;
    this.description = description;
    this.pointReward = pointReward;
    this.xpReward = xpReward;
    this.status = status;
    this.imageURL = null;
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
      pointReward: this.pointReward,
      xpReward: this.xpReward,
      startedAt: this.startedAt,
      endAt: this.endAt,
      status: this.status,
      imageURL: this.imageURL,
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
      data.pointReward,
      data.xpReward,
      data.status
    );
    mission.id = doc.id;
    mission.imageURL = data.imageURL;
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
