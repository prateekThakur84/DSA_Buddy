const Razorpay = require("razorpay");
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});
const SUBSCRIPTION_PLANS = {
  monthly: {
    planId: process.env.RAZORPAY_MONTHLY_PLAN_ID,
    amount: 19900, // ₹199 in paise
    period: "monthly",
    interval: 1,
    name: "Premium Monthly",
  },
  yearly: {
    planId: process.env.RAZORPAY_YEARLY_PLAN_ID,
    amount: 199900, // ₹1999 in paise
    period: "yearly",
    interval: 1,
    name: "Premium Yearly",
  },
};
module.exports = {
  razorpayInstance,
  SUBSCRIPTION_PLANS,
};
