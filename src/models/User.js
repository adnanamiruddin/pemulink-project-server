import { formatDate } from "../helpers/helper.js";

class User {
  constructor(email, fullName, password) {
    this.email = email;
    this.fullName = fullName;
    this.age = null;
    this.city = null;
    this.address = null;
    this.role = "user";
    this.isMembershipOn = false;
    this.xp = 0;
    this.balance = 0;
    this.password = password;
    this.createdAt = new Date();
  }

  toObject() {
    return {
      email: this.email,
      fullName: this.fullName,
      age: this.age,
      city: this.city,
      address: this.address,
      role: this.role,
      isMembershipOn: this.isMembershipOn,
      xp: this.xp,
      balance: this.balance,
      password: this.password,
      createdAt: this.createdAt,
    };
  }

  static getProfile(doc) {
    const data = doc.data();
    const user = new User(data.email, data.fullName, data.password);
    user.id = doc.id;
    user.age = data.age;
    user.city = data.city;
    user.address = data.address;
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
