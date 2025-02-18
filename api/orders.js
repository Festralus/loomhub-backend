const { updateOrderStatus } = require("../controllers/ordersController");

module.exports = async (req, res) => {
  switch (req.method) {
    case "PUT":
      if (req.url.startsWith("/orders/")) {
        const orderId = req.url.split("/")[2]; // Extract orderId from URL
        return updateOrderStatus(req, res, orderId);
      }
      break;
    default:
      return res.status(405).json({ message: "Method Not Allowed" });
  }
};
