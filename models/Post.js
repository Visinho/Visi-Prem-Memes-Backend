const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        max: 1000  
    },
    imgUrl: {
        type: String
    },
    videoUrl: {
        type: String
    },
    likes: {
        type: Array,
        default: []
    }
},
{timestamps: true}
);

module.exports = mongoose.model("Post", PostSchema);