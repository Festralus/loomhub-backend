const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().exec();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new user
// exports.createUser = async (req, res) => {
//   try {
//     const { email, password, nickname } = req.body;
//     const role = "empty";
//     const profilePicUrl = "empty";
//     const address = [];

//     // Check if user already exists
//     const existingUserEmail = await User.findOne({ email }).exec();
//     const existingUserNickname = await User.findOne({ nickname }).exec();

//     if (existingUserEmail) {
//       return res.status(400).json({ message: "Email already exists" });
//     }
//     if (existingUserNickname) {
//       return res.status(400).json({ message: "Nickname already exists" });
//     }

//     // Create new user
//     // Password
//     const saltRounds = 10;
//     const salt = await bcrypt.genSalt(saltRounds);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // GID
//     const GID = `user-${uuidv4()}`;

//     const newUser = new User({
//       email,
//       password: hashedPassword,
//       nickname,
//       GID,
//       role,
//       profilePicUrl,
//       address,
//     });

//     await newUser.save();

//     res.json({ message: "User created successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { nickname, password } = req.body;
    // console.log(email);
    const role = "user";
    const profilePicUrl = "empty";
    const address = null;

    // Check if user already exists
    // Email and Nickname
    // const existingUserEmail = await User.findOne({ email }).exec();
    const existingUserNickname = await User.findOne({ nickname }).exec();

    // if (existingUserEmail) {
    //   return res.status(400).json({ message: "Email already exists" });
    // }
    if (existingUserNickname) {
      return res.status(400).json({ message: "Nickname already exists" });
    }

    // Create new user
    // Password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // GID
    const GID = `user-${uuidv4()}`;

    const newUser = new User({
      // email,
      nickname,
      password: hashedPassword,
      GID,
      role,
      address,
      profilePicUrl,
    });

    await newUser.save();

    res.json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { nickname, password } = req.body;
    // Allows to login via nickname as well as email
    // const nickname = email;

    // Find user by email OR nickname
    const user = nickname.includes("@")
      ? await User.findOne({ email }).exec()
      : await User.findOne({ nickname }).exec();

    // If no user found
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    // If passwords don't match
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = { id: user.GID };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "12h",
    });

    // Send token in response
    res.json({
      user,
      token,
      message: "Login successful",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Check if the entered nickname is available
exports.checkNicknameAvailability = async (req, res) => {
  try {
    const { nickname } = req.body;

    const user = await User.findOne({ nickname }).exec();

    if (user) {
      return res
        .status(200)
        .json({ message: "This nickname is already taken" });
    } else if (!user) {
      return res.status(200).json({ message: "This nickname is available" });
    } else {
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
