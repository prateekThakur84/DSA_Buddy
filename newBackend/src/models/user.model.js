const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    lastName: {
      type: String,
      maxLength: 20,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      immutable: true,
    },
    age: {
      type: Number,
      min: 6,
      max: 80,
    },
    role: {
      type: String,
      enum: ["user", "admin", "premium"],
      default: "user",
    },
    problemSolved: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "problem",
        },
      ],
      default: [],
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Password required only if not Google OAuth user
      },
    },
    // Email verification fields
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    emailVerificationTokenExpires: {
      type: Date,
      default: null,
    },
    // Google OAuth fields
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    // Password reset fields
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetTokenExpires: {
      type: Date,
      default: null,
    },
    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    subscriptionTier: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
      index: true,
    },
    subscriptionStartDate: {
      type: Date,
      default: null,
    },
    subscriptionEndDate: {
      type: Date,
      default: null,
    },
    razorpaySubscriptionId: {
      type: String,
      default: null,
      // sparse: true,
      // unique: true,
    },
    razorpayCustomerId: {
      type: String,
      default: null,
    },
    usageLimits: {
      codeExecutions: {
        used: { type: Number, default: 0 },
        limit: { type: Number, default: 25 },
        lastReset: { type: Date, default: Date.now },
      },
      aiChatQueries: {
        used: { type: Number, default: 0 },
        limit: { type: Number, default: 10 },
        lastReset: { type: Date, default: Date.now },
      },
      videoSolutionViews: {
        used: { type: Number, default: 0 },
        limit: { type: Number, default: 5 },
        lastReset: { type: Date, default: Date.now },
      },
      editorialAccess: {
        used: { type: Number, default: 0 },
        limit: { type: Number, default: 5 },
        lastReset: { type: Date, default: Date.now },
      },
    },
    paymentHistory: [
      {
        orderId: String,
        paymentId: String,
        subscriptionId: String,
        amount: Number,
        currency: String,
        status: String,
        planType: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
// userSchema.index({ emailId: 1 });
// userSchema.index({ googleId: 1 });
userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ passwordResetToken: 1 });

// Pre-save middleware for Google OAuth users
userSchema.pre("save", function (next) {
  if (this.googleId && !this.isEmailVerified) {
    this.isEmailVerified = true; // Google accounts are pre-verified
  }
  next();
});

// Post middleware to clean up submission data
userSchema.post("findOneAndDelete", async function (userInfo) {
  if (userInfo) {
    await mongoose.model("submission").deleteMany({ userId: userInfo._id });
  }
});

// Indexes for faster queries
userSchema.index({ subscriptionTier: 1, subscriptionEndDate: 1 });
userSchema.index({ razorpaySubscriptionId: 1 });

// Helper method to check if user is premium
userSchema.methods.isPremiumActive = function () {
  return (
    this.subscriptionTier === "premium" &&
    this.subscriptionEndDate &&
    this.subscriptionEndDate > new Date()
  );
};

// Helper method to check feature limit
userSchema.methods.canUseFeature = function (featureName) {
  if (this.isPremiumActive()) return true;

  const usage = this.usageLimits?.[featureName];
  return usage && usage.used < usage.limit;
};

const User = mongoose.model("user", userSchema);
module.exports = User;
