const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    oldPrice: {
      type: Number,
      default: null,
    },
    images: {
      type: [String],
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    brandStyleID: {
      type: String,
      required: true,
    },
    productCategory: {
      type: String,
      // enum: ["T-shirt", "Jeans", "Jacket", "Sweater", "Shoes"],
      required: true,
    },
    clothingType: {
      type: String,
      enum: ["Men", "Women", "Unisex"],
      required: true,
    },
    colors: {
      type: [String],
      required: true,
    },
    sizes: {
      type: [String],
      required: true,
    },
    stock: [
      {
        size: {
          type: String,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },
    salesCount: {
      type: Number,
      default: 0,
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
    detailsImages: {
      type: [String],
      required: true,
    },
    GID: {
      type: String,
      requied: true,
    },
    dressStyle: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
