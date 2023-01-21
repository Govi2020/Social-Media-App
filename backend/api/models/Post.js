const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default:""
        },
        likes: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const PostSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
            max: 500,
        },
        src: {
            type: String,
        },
        srcType:{
            type: String,
            enum:["image","video"]
        },
        name:{
            type: String
        },
        likes: {
            type: Array,
            default: [],
        },
        comments: [CommentSchema],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("post", PostSchema);
