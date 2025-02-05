const express = require("express");
const router = express.Router();
const passport = require("../services/passportService");

// Protected route
router.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const payload = {
      nickname: req.user.nickname,
      profilePicUrl: req.user.profilePicUrl,
    };

    res.json(payload);
  }
);

module.exports = router;
