const express = require("express");
const cors = require("cors");
const passport = require("./services/passportService");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Create an app
const app = express();

// CORS configuration options
const corsOptions = {
  origin: ["http://localhost:3000", "https://loomhub.vercel.app"],
  credentials: true,
  optionsSuccessStatus: 204,
};

// Middleware
app.use(express.json());
// app.use(cors(corsOptions));
app.use();
app.use(passport.initialize());

// Getting keys
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 40000,
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
