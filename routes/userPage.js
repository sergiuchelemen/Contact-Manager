const express = require("express");
const path = require("path");
const Contact = require("../models/contactModel");
const router = express.Router();

router.use(require("../middlewares/cookieJwtAuth"));

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
    await Contact.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      phone: phone,
      user_id: req.user.id,
    });
    res.json({ message: "User added" });
  } catch (e) {
    console.log(e);
    res.json({ message: "An error occured." });
  }
});

// delete request
router.route("/").delete(async (req, res) => {
  try {
    const { firstname, lastname, email, phone } = req.body;
    await Contact.deleteOne({
      firstname: firstname,
      lastname: lastname,
      email: email,
      phone: phone,
    });
    res.status(200).json({ message: "User deleted" });
  } catch (e) {
    res.status(400).json({ message: "An error occured" });
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
    res.status(200).json({ message: "User modified" });
  } catch (err) {
    res.status(400).json({ message: "Internal server error" });
    console.log(err);
  }
});

module.exports = router;
