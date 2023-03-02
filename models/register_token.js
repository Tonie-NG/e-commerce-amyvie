const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },

    token: {
      type: String,
      required: true,
    },
  },
  { expireAfterSeconds: 7200 },
  { timestamps: true }
);

module.exports = mongoose.model("Token", TokenSchema);
