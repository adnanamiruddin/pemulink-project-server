import { formatDate } from "../helpers/helper.js";

class Competition {
  constructor(name, description, status) {
    this.name = name;
    this.description = description;
    this.status = status;
    this.startedAt = null;
    this.endAt = null;
    this.createdAt = new Date();
    this.createdBy = null;
    this.updatedAt = new Date();
    this.updatedBy = null;
  }

  toObject() {
    return {
      name: this.name,
      description: this.description,
      status: this.status,
      startedAt: this.startedAt,
      endAt: this.endAt,
      createdAt: this.createdAt,
      createdBy: this.createdBy,
      updatedAt: this.updatedAt,
      updatedBy: this.updatedBy,
    };
  }

  static toFormattedObject(doc) {
    const data = doc.data();
    const competition = new Competition(
      data.name,
      data.description,
      data.status
    );
    competition.id = doc.id;
    competition.startedAt =
      data.startedAt !== null ? formatDate(data.startedAt) : null;
    competition.endAt = data.endAt !== null ? formatDate(data.endAt) : null;
    competition.createdAt = formatDate(data.createdAt);
    competition.createdBy = data.createdBy;
    competition.updatedAt = formatDate(data.updatedAt);
    competition.updatedBy = data.updatedBy;
    return competition;
  }
}

export default Competition;
