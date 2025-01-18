const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

// Mongoose models
const User = require("./models/User");
const WebsiteReview = require("./models/WebsiteReview");

// Helper to create hashed passwords
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Generate users
const users = Array.from({ length: 30 }, (_, i) => ({
  email: `user${i + 1}@example.com`,
  nickname: `User${i + 1}`,
  password: "123",
  GID: `GID${i + 1}`,
  role: "user",
  profilePicUrl: `https://example.com/profilepics/user${i + 1}.jpg`,
  address: [
    {
      type: "shipping",
      country: `Country${i + 1}`,
      city: `City${i + 1}`,
      state: `State${i + 1}`,
      street: `Street${i + 1}`,
      zipcode: `${10000 + i}`,
    },
  ],
}));

// Generate reviews
const reviews = Array.from({ length: 30 }, (_, i) => ({
  rating: Math.floor(Math.random() * 3 + 3),
  comment: `This is a sample review number ${i + 31}.`,
}));

(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Clear collections (optional, for seeding fresh data)
    await User.deleteMany();
    await WebsiteReview.deleteMany();

    // Insert users
    const userDocs = [];
    for (const user of users) {
      const hashedPassword = await hashPassword(user.password);
      userDocs.push(await User.create({ ...user, password: hashedPassword }));
    }

    console.log("Users seeded:", userDocs.length);

    // Insert reviews, associating each with a random user
    const reviewDocs = [];
    for (const [index, review] of reviews.entries()) {
      const randomUser = userDocs[index % userDocs.length]; // Assign reviews round-robin
      reviewDocs.push(
        await WebsiteReview.create({ ...review, user: randomUser._id })
      );
    }

    console.log("Reviews seeded:", reviewDocs.length);

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding data:", error);
    mongoose.connection.close();
  }
})();
