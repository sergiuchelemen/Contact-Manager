const mongoose = require("mongoose");
let dbUrl;
if (process.env.NODE_ENV === "production") {
  dbUrl = process.env.MONGODB_URI_PROD;
} else {
  dbUrl = process.env.MONGODB_URI_DEV;
}

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
