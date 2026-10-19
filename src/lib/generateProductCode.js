 
import Counter from "../models/Counter";

export const generateProductCode = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "product" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const padded = String(counter.seq).padStart(11, "0");
  return `PROXID${padded}`;
};
