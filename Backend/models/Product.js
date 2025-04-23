import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
    },
    price:{
        type: Number,
        required: true
    },
    sizes:{
        type: String,
    },
    category:{
        //isko sagi karna hai kyu ki hume category ko dynamically set krna hai
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
        // type: String,
        // required: true

    },
    images: [String],
    stock:{
        type: Number,
        default: 0
    },
    sku: {
        type: String,
    },
    tags: [String]
}, {timestamps: true});

const Product =  mongoose.model("Product", productSchema);

export default Product