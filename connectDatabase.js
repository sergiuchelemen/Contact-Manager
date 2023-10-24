const mongoose = require("mongoose");
const dbUrl = process.env.MONGODB_URI;

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(dbUrl);
    console.log(
      "Connected to MongoDB ->",
      `Host: ${connect.connection.host},`,
      `Name: ${connect.connection.name}`
    );
  } catch (err) {
    console.log("Error connecting to MongoDB: ", err);
  }
};

module.exports = connectDb;
