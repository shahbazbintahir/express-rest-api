// third party import
const mongoose = require("mongoose");

// access schema from mongoose
const Schema = mongoose.Schema;

// create Object of schema for role
const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600, // for 10min
    },
});

// export model
module.exports = mongoose.model("token", tokenSchema);