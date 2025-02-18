const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res) => {
  switch (req.method) {
    case "POST":
      const { nickname, password } = req.body;
      const user = await User.findOne({ nickname }).exec();
      if (!user || !password || password !== user.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.GID }, process.env.SECRET_KEY, {
        expiresIn: "12h",
      });
      res.status(200).json({ token });
      break;
    default:
      res.status(405).json({ message: "Method Not Allowed" });
  }
};
