import mongoose from "mongoose";

const resetTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export default mongoose.models.ResetToken || mongoose.model("ResetToken", resetTokenSchema);
