const Product = require("../models/product_schema");
const cloudinary = require("../utilities/upload");

const create_product = async (req, res) => {
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
    return res.status(500).send(error.message);
  }
};

const get_products = async (req, res) => {
  try {
    const query = req.query.new;
    const Products = query
      ? await Product.find().sort({ date: -1 })
      : await Product.find();
    if (!Products) {
      return res.status(404).json({ error: "No Products found" });
    }

    return res.status(200).json(Products);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const get_product = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const delete_product = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).json("Product has been deleted...");
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const update_product = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.status(200).json(updatedProduct);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = {
  create_product,
  get_products,
  get_product,
  delete_product,
  update_product,
};
