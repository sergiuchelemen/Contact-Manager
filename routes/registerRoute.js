const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

router.route("/").get((req, res) => {
  const filePath = path.join(__dirname, "../pages/register-page.html");
  res.status(200).sendFile(filePath);
});

router.route("/").post(async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      res.status(409).json({ message: "User already exists" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "User created",
      redirectTo: "http://localhost:3000/login",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
