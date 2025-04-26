const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { v4: uuidv4 } = require("uuid");

// Get all users
// exports.getUsers = async (req, res) => {
//   try {
//     const users = await User.find().exec();
//     res.json(users);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

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
      profilePicUrl:
        "https://i.pinimg.com/736x/b7/5b/29/b75b29441bbd967deda4365441497221.jpg",
    });

    await newUser.save();

    res.json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Check if the entered nickname is available
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
exports.checkNicknameAvailability = async (req, res) => {
  try {
    const { nickname } = req.body;

    if (!nickname || nickname.trim() === "") {
      return res.status(400).json({ message: "Nickname is required" });
    }

    // const user = await User.findOne({ nickname }).exec();
    const user = await User.findOne({
      nickname: {
        $regex: new RegExp("^" + escapeRegExp(nickname) + "$", "i"),
      },
    }).exec();

    if (user) {
      return res.status(200).json({ available: false });
    }
    return res.status(200).json({ available: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { nickname, password } = req.body;

    if (
      nickname.length < 5 ||
      nickname.length > 20 ||
      !/^[a-zA-Z0-9_]+$/.test(nickname)
    ) {
      return res.status(400).json({ message: "Nickname format is invalid" });
    }

    if (
      password.length < 5 ||
      password.length > 20 ||
      !/^[a-zA-Z0-9]+$/.test(password)
    ) {
      return res.status(400).json({ message: "Password format is invalid" });
    }

    const user = await User.findOne({
      nickname: {
        $regex: new RegExp("^" + escapeRegExp(nickname) + "$", "i"),
      },
    }).exec();

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
      user: user.nickname,
      token,
      message: "Login successful",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
