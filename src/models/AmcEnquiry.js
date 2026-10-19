import mongoose from 'mongoose';

const AMCEnquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  mobile: { type: String, required: true },
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.AMCEnquiry || mongoose.model('AMCEnquiry', AMCEnquirySchema); 