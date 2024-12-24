const express = require("express");
const router = express.Router();

const {
  getUsers,
  createUser,
  loginUser,
  checkNicknameAvailability,
} = require("../controllers/usersController");
const { getProducts } = require("../controllers/productsController");
const { updateOrderStatus } = require("../controllers/ordersController");

// Endpoints
router.get("/users", getUsers);
router.post("/users", createUser);
router.post("/login", loginUser);
router.post("/nicknameAvailability", checkNicknameAvailability);
router.get("/products", getProducts);
router.put("/orders/:orderId", updateOrderStatus);

module.exports = router;
