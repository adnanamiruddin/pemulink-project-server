import { formatDate } from "../helpers/helper.js";

class MissionAcceptanceReq {
  constructor(userId, missionId, photoEvidence, status) {
    this.userId = userId;
    this.missionId = missionId;
    this.photoEvidence = photoEvidence;
    this.status = status;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.updatedBy = userId;
  }

  toObject() {
    return {
      userId: this.userId,
      missionId: this.missionId,
      photoEvidence: this.photoEvidence,
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
      data.missionId,
      data.photoEvidence,
      data.status
    );
    missionAcceptanceReq.id = doc.id;
    missionAcceptanceReq.createdAt = formatDate(data.createdAt);
    missionAcceptanceReq.updatedAt = formatDate(data.updatedAt);
    missionAcceptanceReq.updatedBy = data.updatedBy;
    return missionAcceptanceReq;
  }
}

export default MissionAcceptanceReq;
