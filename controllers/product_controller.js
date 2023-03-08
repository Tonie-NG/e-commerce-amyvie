const Product = require("../models/product_schema");
const cloudinary = require("../utilities/upload");

const create = async (req, res) => {
  const { name, type, categories, description, price } = req.body;
  const file = req.files.image;

  try {
    if ((!name, !type, !categories, !description, !price, !file)) {
      return res.status(400).json({ error: "Please enter all fields" });
    }

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      public_id: `${Date.now()}`,
      resource_type: "auto",
    });

    const newProduct = new Product({
      name,
      type,
      categories,
      description,
      price,
      image: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

    const savedProduct = await newProduct.save();

    return res.status(200).send({
      public_id: result.public_id,
      url: result.secure_url,
      savedProduct,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { create };
