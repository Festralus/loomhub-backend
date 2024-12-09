const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    GID: {
      type: String,
      required: true,
    },
    stock: {
      type: Array,
      required: true,
    },
    sizes: {
      type: Array,
      required: true,
    },
    colors: {
      type: Array,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
