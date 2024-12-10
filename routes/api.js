const express = require("express");
const router = express.Router();

const { loginUser } = require("../controllers/userController");

// Endpoints
router.post("/login", loginUser);

module.exports = router;
