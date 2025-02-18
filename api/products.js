const {
  getAllProducts,
  getNewArrivals,
  getTopSelling,
  searchProducts,
  productByGid,
} = require("../controllers/productsController");

module.exports = async (req, res) => {
  switch (req.method) {
    case "GET":
      if (req.url === "/products") {
        return getAllProducts(req, res);
      } else if (req.url === "/products/search") {
        return searchProducts(req, res);
      } else if (req.url === "/getNewArrivals") {
        return getNewArrivals(req, res);
      } else if (req.url === "/getTopSelling") {
        return getTopSelling(req, res);
      } else if (req.url === "/productByGid") {
        return productByGid(req, res);
      }
      break;
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
};
