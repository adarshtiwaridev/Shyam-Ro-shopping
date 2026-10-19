import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        mobile: { type: String,default: ""},
        image: { type: String, default: "/images/avatar.png" }, 
        
        password: { type: String ,default: "" },  
        role: { type: String, enum: ["admin", "customer","microadmin"], default: "customer" },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
