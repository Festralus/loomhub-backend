const mongoose = require("mongoose");

const ProductReviewSchema = new mongoose.Schema(
  {
    product: {
      type: String,
      ref: "Product",
      required: true,
    },
    user: { type: String, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductReview", ProductReviewSchema);
