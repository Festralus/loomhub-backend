const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
dotenv.config();

// Models
const User = require("../models/User");
const ProductReview = require("../models/ProductReview");

// Good comments
const goodComments = [
  // Short good comments
  "Absolutely love this product!",
  "Quality exceeded my expectations.",
  "Fits perfectly and looks amazing.",
  "Very comfortable and stylish.",
  "Super happy with my purchase!",
  "Great value for the price.",
  "Exactly what I was looking for.",
  "Feels premium and durable.",
  "Looks even better in person!",
  "Highly recommend this to everyone.",
  // Long good comments
  "This product quickly became my favorite! The fabric feels premium, and the stitching is incredibly neat. I was pleasantly surprised by how breathable and lightweight it is while still feeling sturdy. It’s perfect for both casual and professional settings. I’ve received several compliments already. Absolutely worth every penny!",
  "I can't believe how well this item fits. It hugs the body perfectly without being restrictive and moves naturally with you. Even after multiple washes, it hasn't lost its shape or color. The attention to detail is just outstanding, from the fabric choice to the stitching. Will definitely buy again!",
  "From unboxing to the first wear, everything about this product screamed quality. It’s rare to find something so comfortable and stylish at the same time. The material feels soft against the skin and holds up great after a busy day. Can't recommend it enough if you’re looking for versatility!",
  "One of the best purchases I’ve made this year! The design is versatile, allowing me to dress it up or down depending on the occasion. Even after long hours of wear, it remains comfortable. The craftsmanship shows in every little detail. Very impressed with this brand.",
  "I was hesitant at first, but I’m glad I went for it. The fit is absolutely spot-on and the look is just sleek and polished. Feels far more expensive than it actually is. The durability after multiple wears is impressive. Totally satisfied!",
  "I’m blown away by how good this product is. It fits like a dream and feels incredibly durable yet lightweight. The attention to detail is evident, from the high-quality zippers to the flawless stitching. Definitely my new go-to piece!",
  "Exceeded every expectation I had. The color stays vibrant even after washing, and the fabric remains soft and fresh. Perfect balance between comfort and style. I wear it at work and during casual weekends — works for everything!",
  "Not only does it fit like it was tailored for me, but it also feels fantastic against the skin. The craftsmanship is on another level. Every seam, every detail is polished. Hands down one of my favorite pieces now!",
  "I’m genuinely impressed with the overall build and quality. Lightweight but very solid construction. Breathes well, fits perfectly, and transitions effortlessly between different outfits. Great job by the designers!",
  "This is the type of product that makes you feel instantly more confident when you wear it. From fit to fabric, every element is done right. Comfortable, stylish, and absolutely worth the price.",
];

// Bad comments
const badComments = [
  // Short bad comments
  "Very disappointed with the quality.",
  "Doesn’t fit as expected.",
  "Material feels cheap and uncomfortable.",
  "Not worth the money.",
  "Color faded after one wash.",
  "Poor stitching and loose threads.",
  "Feels flimsy and weak.",
  "Looks nothing like the pictures.",
  "Started tearing after first use.",
  "Definitely won’t buy from here again.",
  // Long bad comments
  "This was a major disappointment. The material felt thin and cheap right out of the box. After just one wash, the color faded badly, and the stitching started coming undone. I expected much better for the price. Save your money and look elsewhere!",
  "Terrible quality. The fit was completely off compared to the size guide. After wearing it for just a few hours, I noticed loose threads everywhere. It feels uncomfortable and looks poorly made. Definitely not worth the hype.",
  "I really regret buying this. It feels flimsy, and the fabric is scratchy against the skin. The item looked way better in the pictures than in reality. Customer service was also unhelpful when I raised my concerns. Very disappointing experience.",
  "Cheaply made and poorly designed. The seams started splitting within a few wears. It doesn’t breathe well either, making it uncomfortable for daily use. Honestly, I wouldn’t even recommend this at a discount.",
  "Extremely dissatisfied. The item arrived with a strong chemical smell that didn’t go away even after washing. The fit is awkward, and the fabric feels like it’ll tear any minute. Bad experience overall.",
  "I had high hopes based on the pictures, but reality was very different. The material is stiff, and the fit is so odd that it’s almost unwearable. It creased badly and looked worn out after just a day of use. Would not buy again.",
  "Awful experience from start to finish. Shipping took forever, and when the product finally arrived, it was defective. The zippers were stuck, and the seams were poorly stitched. Very bad quality control.",
  "Fabric is rough, uncomfortable, and looks cheap. It doesn’t hold its shape at all and wrinkles terribly. I was expecting something much better based on the description. Huge letdown.",
  "Within the first week of wearing it, multiple seams started unraveling. It’s clear that no real care went into making this product. Doesn’t hold up to normal daily wear. Waste of money!",
  "The product felt like a knock-off version of what was advertised. Poor attention to detail everywhere — stitching errors, loose threads, and faded colors right out of the package. Avoid at all costs.",
];

// Helper to pick random comment based on mood
const getRandomComment = (mood) => {
  if (mood === "good") {
    return goodComments[Math.floor(Math.random() * goodComments.length)];
  } else {
    return badComments[Math.floor(Math.random() * badComments.length)];
  }
};

// Helper to generate random date within last year
const getRandomDate = () => {
  const today = new Date();
  const lastYear = new Date(
    today.getFullYear() - 1,
    today.getMonth(),
    today.getDate()
  );
  const randomTime =
    lastYear.getTime() + Math.random() * (today.getTime() - lastYear.getTime());
  return new Date(randomTime);
};

// Main function to generate targeted reviews
const generateTargetedReviews = async (
  productGID,
  mood = "good",
  count = 10
) => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    const users = await User.find({});
    if (!users.length) {
      throw new Error("No users found to assign reviews.");
    }

    const reviews = Array.from({ length: count }, () => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomRating =
        mood === "good"
          ? Math.floor(Math.random() * 2) + 4 // 4 or 5 stars
          : Math.floor(Math.random() * 2) + 1; // 1 or 2 stars
      const uuid = uuidv4();
      const randomDate = getRandomDate();

      return {
        product: productGID,
        user: randomUser.GID,
        rating: randomRating,
        comment: getRandomComment(mood),
        GID: `product_review-${uuid}`,
        createdAt: randomDate,
        updatedAt: randomDate,
      };
    });

    await ProductReview.insertMany(reviews);

    console.log(
      `✅ Successfully created ${reviews.length} '${mood}' reviews for product GID: ${productGID}`
    );
  } catch (error) {
    console.error("❌ Error generating targeted reviews:", error);
  } finally {
    mongoose.connection.close();
  }
};

generateTargetedReviews("item-d1ff4a83-58f0-4221-a694-58a7bdeb2f14", "bad", 14);
