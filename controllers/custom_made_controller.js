const Custom = require("../models/custom_schema");

const add_custom_wear = async (req, res) => {
  const user = req.data;
  try {
    const { size, color, message } = req.body;
    if ((!size, !color)) {
      return res.status(400).json({ error: "Please enter all fields" });
    }
    const newCustom = new Custom({
      userId: user.id,
      size,
      color,
      message,
    });

    const savedCustom = await newCustom.save();
    return res.status(201).send({ savedCustom });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const get_custom_wear = async (req, res) => {
  try {
    const customwear = await Custom.findById(req.params.id);
    if (!customwear) {
      return res
        .status(404)
        .json({ error: `Custom wear with ${req.params.id} not found ` });
    }
    return res.status(200).json(customwear);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const get_all_custom_wears = async (req, res) => {
  try {
    const customwears = await Custom.find().sort({ date: -1 });

    if (!customwears) {
      return res.status(404).json({ error: "No custom wear found" });
    }

    return res.status(200).json(customwears);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const update_custom_wear = async (req, res) => {
  try {
    const updatedCustomWear = await Custom.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!updatedCustomWear) {
      return res.status(404).json({ error: "No Custom wear not found" });
    }
    return res.status(201).json(updatedCustomWear);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const delete_custom_wear = async (req, res) => {
  try {
    await Custom.findByIdAndDelete(req.params.id);
    res.status(204).json("Custom wear has been deleted...");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = {
  add_custom_wear,
  get_custom_wear,
  get_all_custom_wears,
  update_custom_wear,
  delete_custom_wear,
};
