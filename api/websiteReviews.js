const {
  GetWebsiteReviews,
} = require("../controllers/websiteReviewsController");

module.exports = async (req, res) => {
  switch (req.method) {
    case "GET":
      return GetWebsiteReviews(req, res);
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
};
