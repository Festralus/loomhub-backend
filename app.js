const express = require("express");
const cors = require("cors");
const passport = require("./services/passportService");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Create an app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Getting keys
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

// Import routes
const apiRoutes = require("./routes/api");
const authRoutes = require("./routes/authRoutes");

// Set up routes
app.use("/api", apiRoutes);
app.use("/auth", authRoutes);

// Start the server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
