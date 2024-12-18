const Product = require("../models/Product");

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).exec();

    const payload = products.map((product) => ({
      name: product.name,
      description: product.description,
      price: product.price,
      GID: product.GID,
      stock: product.stock,
      images: product.images,
      timestamps: product.timestamps,
    }));

    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
