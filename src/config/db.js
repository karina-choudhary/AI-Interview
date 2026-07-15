const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/aiInterviewDB");

    console.log("✅ Database Connected");
  } catch (error) {
    console.log("❌ Database Connection Failed");
    console.log(error.message);
  }
};

module.exports = connectDB;