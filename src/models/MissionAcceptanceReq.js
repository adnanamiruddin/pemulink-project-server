import { formatDate } from "../helpers/helper.js";

class MissionAcceptanceReq {
  constructor(userId, missionId, photoEvidenceURL, status) {
    this.userId = userId;
    this.missionId = missionId;
    this.photoEvidenceURL = photoEvidenceURL;
    this.status = status;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.updatedBy = userId;
  }

  toObject() {
    return {
      userId: this.userId,
      missionId: this.missionId,
      photoEvidenceURL: this.photoEvidenceURL,
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
      data.photoEvidenceURL,
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
