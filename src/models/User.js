import { formatDate } from "../helpers/helper.js";

class User {
  constructor(userUID, firstName, lastName) {
    this.userUID = userUID;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = null;
    this.city = null;
    this.address = null;
    this.phoneNumber = null;
    this.role = "user";
    this.isMembershipOn = false;
    this.xp = 0;
    this.balance = 0;
    this.createdAt = new Date();
  }

  toObject() {
    return {
      userUID: this.userUID,
      firstName: this.firstName,
      lastName: this.lastName,
      age: this.age,
      city: this.city,
      address: this.address,
      phoneNumber: this.phoneNumber,
      role: this.role,
      isMembershipOn: this.isMembershipOn,
      xp: this.xp,
      balance: this.balance,
      createdAt: this.createdAt,
    };
  }

  static getProfile(doc) {
    const data = doc.data();
    const user = new User(data.userUID, data.firstName);
    user.id = doc.id;
    user.age = data.age;
    user.city = data.city;
    user.address = data.address;
    user.phoneNumber = data.phoneNumber;
    user.role = data.role;
    user.isMembershipOn = data.isMembershipOn;
    user.xp = data.xp;
    user.balance = data.balance;
    user.password = undefined;
    user.createdAt = formatDate(data.createdAt);
    return user;
  }
}

export default User;
