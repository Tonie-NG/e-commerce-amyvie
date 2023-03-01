const crypto = require("crypto");
const User = require("./user_schema");
const Token = require("./user_token");
const ResetToken = require("./user_reset_token");
const sendMail = require("../utilities/sendemail");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 60 * 60; // use to set the expiry period of the jwt and cookie

const register = async (req, res) => {
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
        email: email.toLowerCase(),
      });
      await newToken.save();
      const message = token;
      const subject = "Verify your email";
      const sentEmail = await sendMail(email, subject, message);
    } else {
      const token = checkToken.token;
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
};

const verify = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: "Please enter all fields" });
    }

    const checkToken = await Token.findOne({ token });
    if (!checkToken) {
      return res.status(400).json({ error: "Invalid token" });
    }
    const user = await User.findOne({ email: checkToken.email });
    user.verified = true;
    await user.save();
    await checkToken.remove();

    return (
      res.cookie("email", user.email, {
        httpOnly: true,
        maxAge: maxAge * 1000,
      }),
      res.status(200).json({ message: "Email Verified", user })
    );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const get_details = async (req, res) => {
  const email = req.email;
  try {
    const { gender, phonenumber, dateofbirth } = req.body;

    if (!gender || !phonenumber || !dateofbirth) {
      return res.status(400).json({ error: "Please enter all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    user.gender = gender;
    user.phonenumber = phonenumber;
    user.dateofbirth = dateofbirth;

    await user.save();
    return res.status(200).json({ message: "Details updated" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const get_password = async (req, res) => {
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
      res.status(200).json({ message: "Password updated" }),
      res.cookie("email", " ", { maxAge: 1 })
    );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please enter all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const access_token = jwt.sign(
      {
        email: user.email,
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: maxAge,
      }
    );

    return (
      res.cookie("jwt", access_token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
      }),
      res.status(200).json({
        message: "Logged in successfully",
        email: user.email,
        access_token,
      })
    );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  return (
    res.cookie("jwt", " ", { maxAge: 1 }),
    res.status(200).json({ message: "Logged out" })
  );
};

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
  verify,
  get_password,
  register,
  get_details,
  login,
  logout,
  forgot_password,
  verify_token,
  reset_password,
};
