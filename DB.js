require("dotenv").config();
const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_REMOTE);
    console.log("Database connection established");
  } catch (err) {
    console.log({error: err});
    // console.log("🦀🦀 ", err.msg);
    // console.log("🦀🦀 ", err.stack);
    // console.log("🦀🦀 ", err);
  }
};

module.exports = dbConnect;
