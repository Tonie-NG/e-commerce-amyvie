const crypto = require("crypto");
const User = require("../models/user_schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 60 * 60; // use to set the expiry period of the jwt and cookie

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
        id: user.id,
        isAdmin: user.isAdmin,
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

module.exports = {
  login,
  logout,
};
