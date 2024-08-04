const mongoose = require('mongoose');

const EstimateSchema = mongoose.Schema(
    {
        title {
            type: String,
            required: [true, "Please enter inquiry title"]
        },

        name: {
            type: String,
            required: [true, "Please enter your name"]
        },

        detail: {
            type: String,
            required: [true, "Please enter detail"]
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
        }
    },
    {
        timestamps: true  // Automatically adds createdAt and updatedAt fields
    }
);

const Estimate = mongoose.model("Estimate", EstimateSchema);

module.exports = Estimate;