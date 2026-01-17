const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');
const { sendWelcomeEmail } = require('../utils/email.util');

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Extract email and photo safely
      const email = profile.emails?.[0]?.value;
      const photo = profile.photos?.[0]?.value;

      if (!email) {
        throw new Error("Google account has no email");
      }

      // Check if user already exists with this Google ID
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        user.lastLoginAt = new Date();
        await user.save();
        return done(null, user);
      }

      // Check if user exists with the same email
      user = await User.findOne({ emailId: email });

      if (user) {
        // Link Google account to existing user
        user.googleId = profile.id;
        user.profilePicture = photo || user.profilePicture;
        user.isEmailVerified = true;
        user.lastLoginAt = new Date();
        await user.save();
        return done(null, user);
      }

      // Create new user
      user = new User({
        googleId: profile.id,
        firstName: profile.name?.givenName || 'User',
        lastName: profile.name?.familyName || '',
        emailId: email,
        profilePicture: photo || '',
        isEmailVerified: true, // Google emails are verified
        lastLoginAt: new Date(),
        role: 'user',
      });

      await user.save();

      // Send welcome email
      await sendWelcomeEmail(user.emailId, user.firstName);

      return done(null, user);
    } catch (error) {
      console.error('Google OAuth error:', error);
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
