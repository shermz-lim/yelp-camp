const mongoose = require('mongoose'),
      Comment = require('./comment.js')


// Defining campground model with mongoose 
const campgroundSchema = new mongoose.Schema({
    name: String,
    location: String,
    img: String,
    price: String,
    description: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User"
        },
        username: String
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Campground", campgroundSchema);