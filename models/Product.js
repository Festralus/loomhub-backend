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
      required: true,
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
      },
    ],
    images: {
      type: Array,
      required: true,
    },
    detailsImages: {
      type: Array,
      required: true,
    },
    rating: { type: Number, min: 0 },
    oldPrice: { type: Number, min: 0 },
    salesCount: { type: Number, min: 0 },
    productCategory: {
      type: String,
      required: true,
      enum: [
        "Shirts",
        "T-shirts",
        "Dresses",
        "Shoes",
        "Sneakers",
        "Boots",
        "Hoodies",
        "Underwear",
        "Nightwear",
        "Suits",
        "Jackets",
        "Jeans",
        "Pants",
        "Coats",
        "Tops",
      ],
    },
    productCategory: {
      type: String,
      required: true,
      enum: ["Men", "Women", "Unisex"],
    },
    composition: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    careInstructions: {
      type: String,
      required: true,
    },
    brandStyleID: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
