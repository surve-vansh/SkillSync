// createAdmin.js

const User = require("./models/user");
const connectDB = require("./config/db");
require("dotenv").config();
connectDB();

const createAdmin = async () => {
  try {
    const admin = await User.create({
      name: "Admin",
      email: "admin@skillsync.com",
      password: "admin123",
      role: "admin",
    });

    console.log("Admin Created:", admin);
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

createAdmin();