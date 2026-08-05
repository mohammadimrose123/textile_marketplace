// In-Memory Storage Fallback when MongoDB is offline/unreachable
const bcrypt = require("bcryptjs");

const users = [];
const buyerProfiles = [];
const supplierProfiles = [];
const products = [
  {
    _id: "p1",
    title: "Organic Egyptian Cotton",
    description: "210 GSM fine plain weave cotton fabric.",
    price: 18.5,
    stock: 2500,
    category: "Cotton",
    colors: ["Natural", "Navy", "White"],
    specifications: { gsm: 210, weave: "Plain" },
  },
  {
    _id: "p2",
    title: "Pure Mulberry Silk Charmeuse",
    description: "19 Momme lustrous satin finish silk.",
    price: 32.0,
    stock: 1200,
    category: "Silk",
    colors: ["Ivory", "Emerald", "Rose"],
    specifications: { momme: 19, weave: "Satin" },
  },
];
const orders = [];

module.exports = {
  users,
  buyerProfiles,
  supplierProfiles,
  products,
  orders,

  async createUser(userData) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const user = {
      _id: `u_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      role: userData.role || "Buyer",
      createdAt: new Date(),
    };
    users.push(user);
    return user;
  },

  findUserByEmail(email) {
    return users.find((u) => u.email === email.toLowerCase());
  },

  findUserById(id) {
    return users.find((u) => u._id === id);
  },

  async matchPassword(enteredPassword, hashedPassword) {
    return await bcrypt.compare(enteredPassword, hashedPassword);
  },

  saveBuyerProfile(data) {
    let profile = buyerProfiles.find((p) => p.user === data.user);
    if (!profile) {
      profile = { _id: `bp_${Date.now()}`, ...data };
      buyerProfiles.push(profile);
    } else {
      Object.assign(profile, data);
    }
    return profile;
  },

  saveSupplierProfile(data) {
    let profile = supplierProfiles.find((p) => p.user === data.user);
    if (!profile) {
      profile = { _id: `sp_${Date.now()}`, ...data };
      supplierProfiles.push(profile);
    } else {
      Object.assign(profile, data);
    }
    return profile;
  },

  getBuyerProfile(userId) {
    return buyerProfiles.find((p) => p.user === userId) || {};
  },

  getSupplierProfile(userId) {
    return supplierProfiles.find((p) => p.user === userId) || {};
  },
};
