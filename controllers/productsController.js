const Product = require("../models/Product");

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).exec();

    const payload = products.map((product) => ({
      name: product.name,
      price: product.price,
      GID: product.GID,
      images: product.images,
      timestamps: product.timestamps,
      rating: product.rating,
      oldPrice: product.oldPrice,
    }));

    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get new arrivals
exports.getNewArrivals = async (req, res) => {
  try {
    const products = (
      await Product.find().sort({ createdAt: -1 }).exec()
    ).slice(0, req.query.limit);

    const payload = products.map((product) => ({
      name: product.name,
      price: product.price,
      GID: product.GID,
      images: product.images,
      timestamps: product.timestamps,
      rating: product.rating,
      oldPrice: product.oldPrice,
    }));

    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get top selling
exports.getTopSelling = async (req, res) => {
  try {
    const products = (
      await Product.find().sort({ salesCount: -1 }).exec()
    ).slice(0, req.query.limit);

    const payload = products.map((product) => ({
      name: product.name,
      price: product.price,
      GID: product.GID,
      images: product.images,
      timestamps: product.timestamps,
      rating: product.rating,
      oldPrice: product.oldPrice,
    }));

    res.json(payload);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
