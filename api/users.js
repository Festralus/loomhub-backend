const {
  createUser,
  loginUser,
  checkNicknameAvailability,
} = require("../controllers/usersController");

module.exports = async (req, res) => {
  switch (req.method) {
    case "POST":
      if (req.url === "/registration") {
        return createUser(req, res);
      } else if (req.url === "/login") {
        return loginUser(req, res);
      } else if (req.url === "/nicknameAvailability") {
        return checkNicknameAvailability(req, res);
      }
      break;
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
};
