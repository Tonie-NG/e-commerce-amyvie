const Product = require("../models/product_schema");

const create = async (req, res) => {
  try {
    const {
      name,
      type,
      image,
      categories,
      description,
      price,
      color,
      size,
      inStock,
    } = req.body;

    if (!name || !type || !image || !categories || !description || !price) {
      return res.status(400).json({ error: "Please enter all fields" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { create };
