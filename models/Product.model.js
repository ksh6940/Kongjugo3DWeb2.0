const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "Please enter your name"]
        },

        useremail: {
            type: String,
            required: [true, "Please enter an email"],
            match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
        },

        deliveryDate: {
            type: Date,
            required: [true, "Please enter a delivery date"]
        },

        address: {
            type: String,
            required: [true, "Please enter an address"]
        },

        product: {
            type: Object, // jsonData 구조에 맞게 객체로 설정
            required: true,
            default: null
        },

        applicationDate: {
            type: Date,
            default: Date.now, // 기본값으로 현재 날짜 설정
            required: false
        }
    },
    {
        timestamps: true // Automatically adds createdAt and updatedAt fields
    }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
