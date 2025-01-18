const WebsiteReview = require("../models/WebsiteReview");

// Get 5 random reviews
exports.GetWebsiteReviews = async (req, res) => {
  try {
    const reviews = await WebsiteReview.aggregate([
      { $sample: { size: 5 } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          _id: 1,
          rating: 1,
          comment: 1,
          name: { $arrayElemAt: ["$user.nickname", 0] },
        },
      },
      { $sort: { rating: -1 } },
    ]);
    // console.log(reviews[0]);
    res.json(reviews);
  } catch (err) {
    console.log(err);
  }
};
