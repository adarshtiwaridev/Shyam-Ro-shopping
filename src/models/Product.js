import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    skuid: {
    type: String,
    unique: true,
    required: true,
    },
    slug: {
    type: String,
    unique: true,
    required: true,
    },
    name: { 
        type: String, 
        required: true,
        trim: true
    },
    images: [{
        type: String,
        required: true
    }],
    description: {
        type: String,
        default: '',
        trim: true
    },
     flipkartLink: {
        type: String,
        default: '',
      
    },
     amazonLink: {
        type: String,
        default: '',
       
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    isTopSeller: {
        type: Boolean,
        default: false
    },
    productType: {
         type: String,
       enum: ["homeproduct", "customproduct", "customplushome"],
       default: "homeproduct"
      }
    
}, { 
    timestamps: true 
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
