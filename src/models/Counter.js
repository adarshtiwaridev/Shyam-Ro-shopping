 
import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 1 },
});

const Counter = mongoose.models.Counter || mongoose.model("Counter", counterSchema);
export default Counter;
