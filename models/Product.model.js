const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"]
        },

        email: {
            type: String,
            required: [true, "Please enter an email"],
            match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
        },

        detail: {
            type: String,
            required: [true, "Please enter product detail"]
        },

        file: {
            type: String,  // File path or URL
            default: null,
            required: false
        },

        applicationDate: {
            type: Date,
            default: Date.now,
            required: false
        },

        deadline: {
            type: Date,
            required: [true, "Please enter a deadline"]
        },

        address: {
            type: String,
            required: [true, "Please enter a address"]
        }
    },
    {
        timestamps: true  // Automatically adds createdAt and updatedAt fields
    }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;