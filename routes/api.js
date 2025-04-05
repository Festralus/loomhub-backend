const express = require("express");
const router = express.Router();

const {
  // getUsers,
  createUser,
  loginUser,
  checkNicknameAvailability,
} = require("../controllers/usersController");
const {
  getProducts,
  getSliderProductsList,
  searchProducts,
  productByGid,
} = require("../controllers/productsController");
const { updateOrderStatus } = require("../controllers/ordersController");
const {
  GetWebsiteReviews,
} = require("../controllers/websiteReviewsController");
const {
  findProductReview,
} = require("../controllers/productReviewsController");

// Endpoints
// router.get("/users", getUsers);
router.post("/users", createUser);
router.post("/login", loginUser);
router.post("/registration", createUser);
router.post("/nicknameAvailability", checkNicknameAvailability);
router.get("/products", getProducts);
router.get("/products/search", searchProducts);
router.get("/getSliderProductsList", getSliderProductsList);
router.put("/orders/:orderId", updateOrderStatus);
router.get("/getWebsiteReviews", GetWebsiteReviews);
router.post("/productByGid", productByGid);
router.post("/findProductReview", findProductReview);

module.exports = router;
