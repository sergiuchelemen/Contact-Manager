const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

router.route("/").get((req, res) => {
  const filePath = path.join(__dirname, "../pages/login-page.html");
  res.sendFile(filePath);
});

router.route("/").post(async (req, res) => {
  const email = req.body.loginEmail;
  const password = req.body.loginPassword;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        {
          user: {
            name: user.name,
            email: user.email,
            id: user.id,
          },
        },
        process.env.ACCESS_KEY,
        { expiresIn: "1h" }
      );
      res.cookie("token", token, {
        httpOnly: true,
      });
      res.status(200).json({ message: "User found" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
