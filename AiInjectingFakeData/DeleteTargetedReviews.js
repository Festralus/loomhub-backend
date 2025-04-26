const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Models
const ProductReview = require("../models/ProductReview");

// Helper to delete good or bad reviews for a product
const deleteTargetedReviews = async (
  productGID,
  mood = "good",
  count = null
) => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    // Determine the rating filter based on mood
    let ratingFilter;
    if (mood === "good") {
      ratingFilter = { rating: { $gte: 3 } }; // 3, 4, or 5 stars
    } else if (mood === "bad") {
      ratingFilter = { rating: { $lte: 3 } }; // 1, 2, or 3 stars
    } else {
      throw new Error("Invalid mood. Use 'good' or 'bad'.");
    }

    // Fetch reviews for the product based on the rating filter
    const reviews = await ProductReview.find({
      product: productGID,
      ...ratingFilter,
    });

    if (reviews.length === 0) {
      console.log("No reviews found to delete for this product.");
      return;
    }

    // If no count is specified, delete all matching reviews
    const deleteCount = count
      ? Math.min(count, reviews.length)
      : reviews.length;

    // Limit the reviews to delete
    const reviewsToDelete = reviews.slice(0, deleteCount);

    // Delete the reviews individually (or in small batches)
    const deletePromises = reviewsToDelete.map((review) =>
      ProductReview.deleteOne({ _id: review._id })
    );

    // Perform the deletion
    await Promise.all(deletePromises);

    console.log(
      `✅ Successfully deleted ${deleteCount} '${mood}' reviews for product GID: ${productGID}`
    );
  } catch (error) {
    console.error("❌ Error deleting targeted reviews:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Example usage
deleteTargetedReviews("item-d1ff4a83-58f0-4221-a694-58a7bdeb2f14", "good", 100);
