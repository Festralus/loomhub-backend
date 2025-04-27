const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    nickname: {
      type: String,
      required: true,
      unique: true,
      // match: /^[a-zA-Z0-9]{3,30}$/,
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
