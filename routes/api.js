const express = require("express");
const router = express.Router();

const {
  getUsers,
  createUser,
  loginUser,
  checkNicknameAvailability,
} = require("../controllers/userController");

// Endpoints
router.get("/users", getUsers);
router.post("/users", createUser);
router.post("/login", loginUser);
router.post("/nicknameAvailability", checkNicknameAvailability);

module.exports = router;
