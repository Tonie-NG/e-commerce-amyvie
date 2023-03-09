const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product must have a name"],
    },
    type: {
      type: String,
      required: [true, "Product must have a type"],
    },
    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    categories: {
      type: String,
      required: [true, "Product must have a category"],
    },
    description: {
      type: String,
      required: [true, "Product must have a description"],
    },
    price: {
      type: Number,
      required: [true, "Product must have a price"],
    },
    color: {
      type: [String],
    },
    size: {
      type: [String],
      default: ["S", "M", "L", "XL", "XXL"],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
