const express = require("express");
const router = express.Router();

const {
  getUsers,
  createUser,
  loginUser,
  checkNicknameAvailability,
} = require("../controllers/usersController");
const {
  getProducts,
  getNewArrivals,
  getTopSelling,
} = require("../controllers/productsController");
const { updateOrderStatus } = require("../controllers/ordersController");

// Endpoints
router.get("/users", getUsers);
router.post("/users", createUser);
router.post("/login", loginUser);
router.post("/nicknameAvailability", checkNicknameAvailability);
router.get("/products", getProducts);
router.get("/getNewArrivals", getNewArrivals);
router.get("/getTopSelling", getTopSelling);
router.put("/orders/:orderId", updateOrderStatus);

module.exports = router;
