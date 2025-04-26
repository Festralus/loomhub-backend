const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Product = require("../models/Product");
const ProductReview = require("../models/ProductReview");

async function connectDB() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    console.log("Connection is established: ", mongoose.connection.readyState);
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
}

async function fetchAllProducts() {
  try {
    const allProducts = await Product.find({});
    console.log("This number of products is fetched: ", allProducts.length);
    return allProducts;
  } catch (err) {
    console.error("Error fetching all products", err);
    return [];
  }
}

async function fetchRatingsForProduct(productGID) {
  const currentProductReviews = await ProductReview.find({
    product: productGID,
  }).select("rating");

  return (currentProductRatings = currentProductReviews.map(
    (item) => item.rating
  ));
  return [];
}

function calculateAverageRating(ratings) {
  if (ratings.length === 0) return 0;

  const ratingsSum = ratings.reduce((a, b) => {
    return a + b;
  }, 0);

  return (currentProductNewRatingVal = (ratingsSum / ratings.length).toFixed(
    2
  ));
}

async function updateProductRating(product, newRating) {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { GID: product },
      { rating: newRating },
      { new: true }
    );
    console.log(`Updated rating for ${product}: `, updatedProduct.rating);
  } catch (err) {
    console.error("Error updating a product rating: ", err);
  }
}

async function syncProductRatings() {
  await connectDB();
  const allProducts = await fetchAllProducts();
  for (const product of allProducts) {
    const ratings = await fetchRatingsForProduct(product.GID);
    const newAverageRating = calculateAverageRating(ratings);
    await updateProductRating(product.GID, newAverageRating);
  }
}

syncProductRatings();
