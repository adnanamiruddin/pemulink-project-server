import { formatDate } from "../helpers/helper.js";

class MissionAcceptanceReq {
  constructor(userId, missionId) {
    this.userId = userId;
    this.missionId = missionId;
    this.status = "pending";
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.updatedBy = null;
  }

  toObject() {
    return {
      userId: this.userId,
      missionId: this.missionId,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      updatedBy: this.updatedBy,
    };
  }

  static toFormattedObject(doc) {
    const data = doc.data();
    const missionAcceptanceReq = new MissionAcceptanceReq(
      data.userId,
      data.missionId
    );
    missionAcceptanceReq.id = doc.id;
    missionAcceptanceReq.status = data.status;
    missionAcceptanceReq.createdAt = formatDate(data.createdAt);
    missionAcceptanceReq.updatedAt = formatDate(data.updatedAt);
    missionAcceptanceReq.updatedBy = data.updatedBy;
    return missionAcceptanceReq;
  }
}

export default MissionAcceptanceReq;
