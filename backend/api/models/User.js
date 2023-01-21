const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
        },
        userAddress:{
            type: String,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true
        },
        profilePicture: {
            type: String,
            default: "",
        },
        coverPicture: {
            type: String,
            default: "",
        },
        followers: {
            type: Array,
            default: [],
        },
        followings: {
            type: Array,
            default: [],
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        description: {
            type: String,
            default:"Hey I am using Govi Social"
        },
        city:{
            type: String,
            default:""
        },
        from:{
            type: String,
            default:""
        },
        relationship:{
            type:String,
            default:"none",
            enum:["single","married","none"]
        },
        staredPosts:{
            type: Array,
            default:[]
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("user", UserSchema);
