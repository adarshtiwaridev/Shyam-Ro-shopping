import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: String,
  code: String,
  expiresAt: Date,
});

export default mongoose.models.Otp || mongoose.model("Otp", otpSchema);
