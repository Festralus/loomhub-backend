const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    nickname: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    GID: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    profilePicUrl: {
      type: String,
      required: true,
    },
    address: [
      {
        type: { type: String, enum: ["shipping", "billing"], required: true },
        country: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: false },
        street: { type: String, required: true },
        zipcode: { type: String, required: false },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
