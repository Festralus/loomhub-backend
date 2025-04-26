const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");

require("dotenv").config();

// Predefined list of 60 unique names (no spaces, CamelCase format)
const namesList = [
  "AliceSmith",
  "BobJohnson",
  "CharlieBrown",
  "DavidWilson",
  "EmilyDavis",
  "FrankMiller",
  "GraceMoore",
  "HannahTaylor",
  "IanAnderson",
  "JackThomas",
  "KarenJackson",
  "LarryWhite",
  "MeganHarris",
  "NathanMartin",
  "OliviaLee",
  "PaulClark",
  "QuincyLewis",
  "RachelWalker",
  "SamYoung",
  "TracyHall",
  "UmaAllen",
  "VictorKing",
  "WendyScott",
  "XanderBaker",
  "YaraNelson",
  "ZaneCarter",
  "AmeliaAdams",
  "BenjaminLee",
  "ChloeKing",
  "DylanPerez",
  "EllaWilson",
  "FinnMurphy",
  "GabrielAllen",
  "HollyRodriguez",
  "IsaacBrooks",
  "JackieGonzalez",
  "KyleCooper",
  "LilyMitchell",
  "MatthewHarris",
  "NinaHarris",
  "OscarYoung",
  "PennyTurner",
  "QuinnWalker",
  "RyanCampbell",
  "SophiaWard",
  "TobyMorgan",
  "UrsulaJames",
  "VeraRobinson",
  "WilliamClark",
  "XenaPhillips",
  "YasmineEvans",
  "ZoeSanders",
  "AdrianCarter",
  "BrendaRoberts",
  "ChristianLewis",
  "DianaBrooks",
  "EthanMoore",
  "FelixWright",
  "GinaClark",
  "HenryMitchell",
];

let namesIndex = 0;

// Helper to get unique name from predefined list
const getRandomName = () => {
  if (namesIndex >= namesList.length) {
    namesIndex = 0; // Reset index if we have exhausted all names
  }
  return namesList[namesIndex++];
};

// Function to create random users
exports.createRandomUsers = async (count = 10) => {
  try {
    // Connect if not connected already
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    const users = [];

    // Generate users
    for (let i = 0; i < count; i++) {
      const fullName = getRandomName();
      const nickname = fullName; // Nickname is the same as the name
      const password = fullName; // Password is the same as the full name
      const profilePicUrl =
        "https://www.zastavki.com/pictures/originals/2014/Nature_The_young_sprout_082380_.jpg"; // Static profile picture URL

      // Password hashing
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Generate GID
      const GID = `user-${uuidv4()}`;

      // Default address (since no address API is being used)
      const address = {
        type: "shipping", // Assuming default "shipping" type
        country: "Unknown",
        city: "Unknown",
        state: "Unknown",
        street: "Unknown",
        zipcode: "Unknown",
      };

      // Create a new user object
      const newUser = new User({
        nickname,
        password: hashedPassword,
        GID,
        role: "user", // Always "user"
        profilePicUrl,
        address: [address], // Assuming we need only one "shipping" address
      });

      users.push(newUser);
    }

    // Insert all users into the database
    if (users.length > 0) {
      await User.insertMany(users);
      console.log(`Successfully created ${users.length} users.`);
    } else {
      console.log("No users created.");
    }
  } catch (error) {
    console.error("Error creating random users:", error);
  } finally {
    mongoose.connection.close();
  }
};

(async () => {
  await exports.createRandomUsers(50); // Adjust the number of users you want to create
})();
