const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

let jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

passport.use(
  "jwt",
  new JwtStrategy(jwtOptions, async (payload, done) => {
    // Find user by id
    try {
      const user = await User.findOne({ GID: payload.id });
      if (user) {
        done(null, user);
      } else {
        console.log("User not found.");
        done(null, false);
      }
    } catch (err) {
      console.error(err);
      done(err);
    }
  })
);

module.exports = passport;
