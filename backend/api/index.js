const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const port = process.env.PORT || 5000;
dotenv.config();

app.use(cors({
    allowedHeaders: "*"
}))
app.use(helmet());
app.use(express.json());
app.use(morgan("common"));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (
            file.originalname.endsWith(".jpg") ||
            file.originalname.endsWith(".png") ||
            file.originalname.endsWith(".jpeg")
        ) {
            cb(null, "public/images");
        } else if (file.originalname.endsWith(".mp4")) {
            cb(null, "public/videos");
        }
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({ storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json("File uploaded successfully");
    } catch (error) {
        console.error(error);
    }
});
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

app.get("/", (req, res) => {
    res.send("Welcome to home page!");
    console.log("Welcome to home page!");
});

const url = process.env.MONGO__URL;

mongoose.connect(
    url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    },
    (err) => {
        console.log(err);
        console.log("Connected to Mongoose");
    }
);

app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/videos", express.static(path.join(__dirname, "public/videos")));

app.listen(port, () => {
    console.log("listening on port " + port);
});
