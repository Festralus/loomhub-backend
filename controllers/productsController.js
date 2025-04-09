const Product = require("../models/Product");
const { v4: uuidv4 } = require("uuid");

// REVIEW START
exports.getProducts = async (req, res) => {
  try {
    // Getting products starts
    const query = {};

    const parseFilter = (param) => {
      if (Array.isArray(param)) return param;
      try {
        return JSON.parse(param);
      } catch (error) {
        console.error(
          `Parsing error while fetching filtered products by ${param}:`,
          error
        );
        return [];
      }
    };

    // Main filter
    if (req.query.productCategory) {
      query.productCategory = { $in: parseFilter(req.query.productCategory) };
    }

    if (req.query.color || req.query.size) {
      query.stock = { $elemMatch: {} };
      if (req.query.color) {
        query.stock.$elemMatch.color = { $in: parseFilter(req.query.color) };
      }
      if (req.query.size) {
        query.stock.$elemMatch.size = { $in: parseFilter(req.query.size) };
      }
    }

    if (req.query.dressStyle) {
      query.dressStyle = { $in: parseFilter(req.query.dressStyle) };
    }

    if (req.query.clothingType) {
      query.clothingType = { $in: parseFilter(req.query.clothingType) };
    }

    if (req.query.brand) {
      query.brand = { $in: parseFilter(req.query.brand) };
    }

    // A list of filtered items
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const payload = products.map(
      ({ description, updatedAt, ...product }) => product
    );
    // Getting products ends

    // Getting products when filters active starts (for correct filter options, smth to refactor):

    const allProductsResponse = await Product.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const allProducts = allProductsResponse.map(
      ({
        description,
        updatedAt,
        salesCount,
        rating,
        createdAt,
        images,
        colors,
        sizes,
        GID,
        price,
        name,
        ...product
      }) => product
    );

    // Getting products when filters active ends

    // Filter counts starts
    // Count available filter options
    const filterCounts = {
      productCategory: {},
      color: {},
      size: {},
      dressStyle: {},
      clothingType: {},
      brand: {},
    };

    const colorProductMap = {};
    const sizeProductMap = {};
    products.forEach((product) => {
      const productId = product._id.toString();

      // Categories
      if (product.productCategory) {
        filterCounts.productCategory[product.productCategory] =
          (filterCounts.productCategory[product.productCategory] || 0) + 1;
      }

      // Colors and sizes
      if (product.stock) {
        product.stock.forEach((stockItem) => {
          if (stockItem.color) {
            if (!colorProductMap[stockItem.color]) {
              colorProductMap[stockItem.color] = new Set();
            }
            colorProductMap[stockItem.color].add(productId);
          }

          if (stockItem.size) {
            if (!sizeProductMap[stockItem.size]) {
              sizeProductMap[stockItem.size] = new Set();
            }
            sizeProductMap[stockItem.size].add(productId);
          }
        });
      }

      // Dress Style
      if (Array.isArray(product.dressStyle)) {
        product.dressStyle.forEach((style) => {
          filterCounts.dressStyle[style] =
            (filterCounts.dressStyle[style] || 0) + 1;
        });
      }

      // Clothing Type
      if (product.clothingType) {
        filterCounts.clothingType[product.clothingType] =
          (filterCounts.clothingType[product.clothingType] || 0) + 1;
      }

      // Brand
      if (product.brand) {
        filterCounts.brand[product.brand] =
          (filterCounts.brand[product.brand] || 0) + 1;
      }
    });

    filterCounts.color = Object.fromEntries(
      Object.entries(colorProductMap).map(([color, products]) => [
        color,
        products.size,
      ])
    );

    filterCounts.size = Object.fromEntries(
      Object.entries(sizeProductMap).map(([size, products]) => [
        size,
        products.size,
      ])
    );

    // Filter counts ends

    res.json({
      products: payload,
      allProducts,
      filterCounts,
    });
  } catch (err) {
    console.error("Error while fetching filtered products:", err);
    res.status(500).json({ message: "Error while fetching filtered products" });
  }
};
// REVIEW END

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
// exports.searchProducts = async (req, res) => {
//   try {
//     const { query } = req.query;
//     if (!query) {
//       return res.status(400);
//     }

//     const regex = new RegExp(query, "i");
//     const products = await Product.find({
//       $or: [
//         { name: regex },
//         { description: regex },
//         { brand: regex },
//         { productCategory: regex },
//       ],
//     }).exec();

//     const payload = products.map((product) => ({
//       name: product.name,
//       description: product.description,
//       brand: product.brand,
//       price: product.price,
//       GID: product.GID,
//       images: product.images,
//       timestamps: product.createdAt,
//       rating: product.rating,
//       oldPrice: product.oldPrice,
//     }));

//     res.json(payload);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const regex = new RegExp(query, "i");
    let results = [];

    // 1. Search by name first
    results = await Product.find({ name: regex }).limit(5).exec();

    // 2. If not enough results, search by productCategory
    if (results.length < 5) {
      const categoryResults = await Product.find({
        productCategory: regex,
        _id: { $nin: results.map((p) => p._id) }, // Exclude already found results
      })
        .limit(5 - results.length)
        .exec();
      results = [...results, ...categoryResults];
    }

    // 3. If still not enough, search by brand
    if (results.length < 5) {
      const brandResults = await Product.find({
        brand: regex,
        _id: { $nin: results.map((p) => p._id) },
      })
        .limit(5 - results.length)
        .exec();
      results = [...results, ...brandResults];
    }

    // 4. If still not enough, search by description
    if (results.length < 5) {
      const descriptionResults = await Product.find({
        description: regex,
        _id: { $nin: results.map((p) => p._id) },
      })
        .limit(5 - results.length)
        .exec();
      results = [...results, ...descriptionResults];
    }

    // Format the response payload
    const payload = results.map((product) => ({
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

// Add an item /item/add_new_item
exports.addNewItem = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      oldPrice,
      images,
      brand,
      productCategory,
      clothingType,
      dressStyle,
      stock,
      rating,
      salesCount = 0, // Set default salesCount to 0 if it's not provided
      sizes,
      colors,
      composition,
      country,
      brandStyleID,
      careInstructions,
      detailsImages,
    } = req.body;

    // If any required field is missing, return an error
    if (
      !name ||
      !price ||
      !images ||
      !productCategory ||
      !clothingType ||
      !stock
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Convert price and rating to numbers
    const priceValue = parseFloat(price); // Ensure price is a number
    const ratingValue = parseFloat(rating); // Ensure rating is a number
    const oldPriceValue = oldPrice === null ? null : parseFloat(oldPrice); // Ensure oldPrice is a number if provided

    // Check if price or rating are not valid numbers
    if (isNaN(priceValue) || isNaN(ratingValue)) {
      return res
        .status(400)
        .json({ message: "Invalid price or rating value." });
    }

    // Generate a unique GID (UUID)
    const GID = uuidv4(); // Use UUID for unique GID
    console.log(GID);

    // Ensure stock is an array with valid items
    if (!Array.isArray(stock) || stock.length === 0) {
      return res
        .status(400)
        .json({ message: "Stock must be an array with at least one item." });
    }

    // Validate that each stock item has the required fields
    stock.forEach((item) => {
      if (!item.size || !item.color || typeof item.quantity !== "number") {
        return res.status(400).json({
          message: "Each stock item must have Size, Color, and Quantity.",
        });
      }
    });

    // Create a new Product instance with the generated GID
    const newProduct = new Product({
      name,
      description,
      price: priceValue, // Save as number
      oldPrice: oldPriceValue, // Save as number or null
      images,
      brand,
      productCategory,
      clothingType,
      dressStyle: dressStyle || [], // Default to empty array if not provided
      stock,
      rating: ratingValue, // Save as number
      salesCount, // Sales count will default to 0 if not provided
      GID,
      sizes,
      colors,
      composition,
      country,
      brandStyleID,
      careInstructions,
      detailsImages,
    });

    console.log(newProduct);
    // Save the new product to the database
    await newProduct.save();

    // Return success response
    res
      .status(201)
      .json({ message: "Product added successfully.", product: newProduct });
  } catch (err) {
    console.error("Error while adding new product:", err);
    res.status(500).json({ message: "Error while adding new product." });
  }
};
