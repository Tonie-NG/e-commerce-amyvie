const crypto = require("crypto");
const User = require("../models/user_schema");
const ResetToken = require("../models/reset_token");
const sendMail = require("../utilities/sendemail");
const bcrypt = require("bcryptjs");
const maxAge = 3 * 24 * 60 * 60; // use to set the expiry period of the jwt and cookie

const forgot_password = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Please enter all fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    const token = crypto.randomBytes(4).toString("hex");
    const messaage = token;
    const subject = "Reset your password";

    const sentEmail = await sendMail(email, subject, messaage);
    const newToken = new ResetToken({
      token,
      email: email.toLowerCase(),
    });
    await newToken.save();
    return (
      res.cookie("email", email, {
        httpOnly: true,
        maxAge: maxAge * 1000,
      }),
      res.status(200).json({
        message: "Email sent, please use the steps to retrieve password",
      })
    );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const verify_token = async (req, res) => {
  const email = req.email;
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: "Please enter all fields" });
    }

    const usertoken = await ResetToken.findOne({ email });

    if (!usertoken) {
      return res.status(400).json({ error: "Invalid token" });
    }

    if (token !== usertoken.token) {
      return res.status(400).json({ error: "Invalid token" });
    }
    await usertoken.remove();
    return res.status(200).json({ message: "Token verified" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const reset_password = async (req, res) => {
  const email = req.email;
  try {
    const { password, repeatpassword } = req.body;
    if (!password || !repeatpassword) {
      return res.status(400).json({ error: "Please enter all fields" });
    }

    if (password !== repeatpassword) {
      return res.status(401).json({ error: "Passwords do not match" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;

    await user.save();

    return (
      res.cookie("email", " ", { maxAge: 1 }),
      res.status(200).json({ message: "Password updated" })
    );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  forgot_password,
  verify_token,
  reset_password,
};
