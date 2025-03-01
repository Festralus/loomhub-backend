const Product = require("../models/Product");

// Get all products
exports.getAllProducts = async (req, res) => {
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

exports.getSliderProductsList = async (req, res) => {
  const limit = parseInt(req.query.limit) || 9;
  try {
    let products;
    let uniqueProducts = [];
    switch (req.query.filterName) {
      // Finding 9 products with highest sales count
      case "getTopSelling":
        products = (await Product.find().sort({ salesCount: -1 }).exec()).slice(
          0,
          req.query.limit
        );
        break;

      // Finding 9 newest products in the database
      case "getNewArrivals":
        products = (await Product.find().sort({ createdAt: -1 })).splice(
          0,
          req.query.limit
        );
        console.log(products);
        break;

      // Find 9 items related to the chosen item by various values
      case "getRelatedItems":
        // Function that exludes item repetition during search
        const uniqueGIDs = new Set();

        function addUniqueProducts(items) {
          for (const item of items) {
            if (!uniqueGIDs.has(item.GID)) {
              uniqueGIDs.add(item.GID);
              uniqueProducts.push(item);
              if (uniqueProducts.length === req.query.limit) return;
            }
          }
        }

        // Find up to 9 items that share product category
        const pipelineCategory = await Product.aggregate([
          {
            $match: {
              $or: [
                {
                  productCategory: req.query.productCategory,
                  clothingType: req.query.clothingType,
                },
                {
                  productCategory: req.query.productCategory,
                  clothingType: "Unisex",
                },
              ],
            },
          },
          { $sample: { size: limit } },
        ]);

        // Exlude the chosen item from the search
        products = pipelineCategory.filter(
          (item) => item.GID != req.query.itemId
        );

        // Add an item from request to avoid repetition
        uniqueGIDs.add(req.query.itemId);
        addUniqueProducts(products);

        if (uniqueProducts.length >= req.query.limit) {
          products = uniqueProducts;
          break;
        }

        // Find up to 9 items that share product brand
        const pipelineBrand = await Product.aggregate([
          {
            $match: {
              $or: [
                {
                  brand: req.query.brand,
                  clothingType: req.query.clothingType,
                },
                { brand: req.query.brand, clothingType: "Unisex" },
              ],
            },
          },
        ]);

        addUniqueProducts(pipelineBrand);

        if (uniqueProducts.length >= req.query.limit) {
          products = uniqueProducts;
          break;
        }

        // Find up to 9 items that share product clothing type
        const pipelineType = await Product.aggregate([
          {
            $match: {
              clothingType: req.query.clothingType,
            },
          },
        ]);

        addUniqueProducts(pipelineType);

        if (uniqueProducts.length >= req.query.limit) {
          products = uniqueProducts;
          break;
        }

        // Find up to 9 items with clothing type: Unisex
        const pipelineUnisex = await Product.aggregate([
          {
            $match: {
              clothingType: "Unisex",
            },
          },
        ]);

        addUniqueProducts(pipelineUnisex);

        products = uniqueProducts;
        break;

      default:
        return res.status(400).json({
          message: "Invalid filter name, fetching slider products list failed.",
        });
    }

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
    res.status(500).json({ message: "Fetching slider products list failed." });
  }
};

// Search products
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400);
    }

    const regex = new RegExp(query, "i");
    const products = await Product.find({
      $or: [{ name: regex }, { description: regex }, { brand: regex }],
    }).exec();

    const payload = products.map((product) => ({
      name: product.name,
      description: product.description,
      brand: product.brand,
      price: product.price,
      GID: product.GID,
      images: product.images,
      timestamps: product.createdAt,
      rating: product.rating,
      oldPrice: product.oldPrice,
    }));

    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a product by GID
exports.productByGid = async (req, res) => {
  try {
    const product = await Product.findOne({ GID: req.body.itemGID });
    // Exclude some fields and values
    const { salesCount, ...payload } = product.toObject();
    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Product not found" });
  }
};
