const Review = require("../models/Review");
const Product = require("../models/Product");

const addOrUpdateReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  const userId = req.user.id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let review = await Review.findOne({ product: productId, user: userId });

    if (review) {
      review.rating = rating;
      review.comment = comment;
      await review.save();
      return res
        .status(200)
        .json({ message: "Review updated successfully", review });
    } else {
      review = new Review({
        product: productId,
        user: userId,
        rating,
        comment,
      });
      await review.save();
      return res
        .status(201)
        .json({ message: "Review added successfully", review });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { addOrUpdateReview };
