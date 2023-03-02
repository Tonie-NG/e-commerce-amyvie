const User = require("../models/user_schema");
const sendMail = require("../utilities/sendemail");
const bcrypt = require("bcrypt");

const get_user = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const get_all_users = async (req, res) => {
  try {
    const query = req.query.new;
    const users = query
      ? await User.find().sort({ date: -1 })
      : await User.find();
    if (!users) {
      return res.status(404).json({ error: "No users found" });
    }

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const update_user = async (req, res) => {
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const delete_user = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json("User has been deleted...");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { get_user, get_all_users, update_user, delete_user };
