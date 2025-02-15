const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    price: { type: Number, required: true, min: 0 },
    GID: {
      type: String,
      required: true,
    },
    stock: [
      {
        size: { type: String, required: true },
        color: { type: String, required: true },
        quantity: { type: Number, required: true, min: 0 },
        clothingType: {
          type: String,
          enum: ["men", "women", "unisex"],
          required: true,
        },
      },
    ],
    images: {
      type: Array,
      required: true,
    },
    rating: {
      type: Number,
    },
    oldPrice: { type: Number, min: 0 },
    salesCount: { type: Number, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
