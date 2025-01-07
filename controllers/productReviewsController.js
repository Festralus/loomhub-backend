const ProductReview = require("../models/ProductReview");
const Product = require("../models/Product");

const addOrUpdateProductReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  const userId = req.user.id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let ProductReview = await ProductReview.findOne({
      product: productId,
      user: userId,
    });

    if (ProductReview) {
      ProductReview.rating = rating;
      ProductReview.comment = comment;
      await ProductReview.save();
      return res
        .status(200)
        .json({ message: "ProductReview updated successfully", ProductReview });
    } else {
      ProductReview = new ProductReview({
        product: productId,
        user: userId,
        rating,
        comment,
      });
      await ProductReview.save();
      return res
        .status(201)
        .json({ message: "ProductReview added successfully", ProductReview });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { addOrUpdateProductReview };
