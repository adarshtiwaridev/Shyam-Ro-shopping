import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  position: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
