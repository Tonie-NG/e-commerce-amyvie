const Message = require("../models/message_schema");

//Message is created alongside the order in the order route
const get_messages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: -1 });

    if (!messages) {
      return res.status(404).json({ error: "No Message found" });
    }

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const get_message = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const delete_message = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.status(204).json("Message has been deleted...");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = { get_message, get_messages, delete_message };
