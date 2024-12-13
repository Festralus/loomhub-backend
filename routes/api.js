const express = require("express");
const router = express.Router();

const {
  getUsers,
  createUser,
  loginUser,
  checkNicknameAvailability,
} = require("../controllers/usersController");
const { getProducts } = require("../controllers/productsController");

// Endpoints
router.get("/users", getUsers);
router.post("/users", createUser);
router.post("/login", loginUser);
router.post("/nicknameAvailability", checkNicknameAvailability);
router.get("/products", getProducts);

module.exports = router;
