const express = require("express");
const path = require("path");
const Contact = require("../models/contactModel");
const cookieJwtAuth = require("../middlewares/cookieJwtAuth");
const router = express.Router();

router.use(cookieJwtAuth);

// get request
router.route("/").get(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.render("index", { contacts: contacts });
});

router.route("/add").get((req, res) => {
  const filePath = path.join(__dirname, "../pages/add-contact.html");
  res.sendFile(filePath);
});

// post request
router.route("/add").post(async (req, res) => {
  try {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const phone = req.body.phone;
    const contact = await Contact.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      phone: phone,
      user_id: req.user.id,
    });
    if (contact) {
      res.status(201).json({ message: "User added" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

// delete request
router.route("/").delete(async (req, res) => {
  try {
    const { firstname, lastname, email, phone } = req.body;
    const contact = await Contact.deleteOne({
      firstname: firstname,
      lastname: lastname,
      email: email,
      phone: phone,
    });
    if (contact) {
      res.status(200).json({ message: "User deleted" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
    console.log(e);
  }
});

// put request
router.route("/").put(async (req, res) => {
  const data = req.body;
  try {
    const user = await Contact.findOneAndUpdate(
      {
        firstname: data.currentData.firstname,
        lastname: data.currentData.lastname,
        email: data.currentData.email,
        phone: data.currentData.phone,
      },
      {
        firstname: data.modifiedData.firstname,
        lastname: data.modifiedData.lastname,
        email: data.modifiedData.email,
        phone: data.modifiedData.phone,
      },
      { new: true }
    );
    if (user) {
      res.status(200).json({ message: "User modified" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
    console.log(err);
  }
});

module.exports = router;
