const crypto = require("crypto");
const express = require("express");
const User = require("./user_schema");
const Token = require("./user_token");
const sendMail = require("../utilities/sendemail");

const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email } = req.body;
    if (!firstname || !email || !lastname) {
      return res.status(400).json({ error: "Please enter all fields" });
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const checkToken = await Token.findOne({ email: email.toLowerCase() });
    if (!checkToken) {
      const token = crypto.randomBytes(4).toString("hex");
      const newToken = new Token({
        token,
        email,
      });
      await newToken.save();
      const message = token;
      const subject = "Verify your email";
      const sentEmail = await sendMail(email, subject, message);
    }

    const newUser = new User({
      firstname: firstname.toLowerCase(),
      email: email.toLowerCase(),
      lastname: lastname.toLowerCase(),
    });
    const savedUser = await newUser.save();

    return res.status(200).json({
      savedUser,
      messaage: "An email has been sent, please verify your account",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
