const express = require("express");
const router = express.Router();

const {
  // getUsers,
  createUser,
  loginUser,
  checkNicknameAvailability,
} = require("../controllers/usersController");
const {
  getAllProducts,
  getNewArrivals,
  getTopSelling,
  searchProducts,
} = require("../controllers/productsController");
const { updateOrderStatus } = require("../controllers/ordersController");
const {
  GetWebsiteReviews,
} = require("../controllers/websiteReviewsController");

// Endpoints
// router.get("/users", getUsers);
router.post("/users", createUser);
router.post("/login", loginUser);
router.post("/registration", createUser);
router.post("/nicknameAvailability", checkNicknameAvailability);
router.get("/products", getAllProducts);
router.get("/products/search", searchProducts);
router.get("/getNewArrivals", getNewArrivals);
router.get("/getTopSelling", getTopSelling);
router.put("/orders/:orderId", updateOrderStatus);
router.get("/getWebsiteReviews", GetWebsiteReviews);

module.exports = router;
