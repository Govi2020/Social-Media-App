const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const fs = require("fs");

//* Create Post *\\
router.post("/", async (req, res) => {
    const { userId, description } = req.body;
    // creating the posts
    console.log(req.body)
    const newPost = new Post(req.body);
    if (!userId) {
        res.send(400).json({ message: "please fill all the fields" });
    }
    try {
        // saving the posts
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.send(400).json({ message: err });
    }
});

//* Update Post *\\

router.put("/:id", async (req, res) => {
    try {
        // getting the post
        const post = await Post.findById(req.params.id);
        post ?? res.status(403).json({ message: "Post not found" });
        if (post.userId === req.body.userId) {
            // updating the post
            await post.updateOne({ $set: req.body });
            res.status(200).send({ message: "post had updated successfully" });
        } else {
            res.status(403).json({ message: "you can only update your posts" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//* Delete Post *\\

router.delete("/:id", async (req, res) => {
    try {
        // getting the post
        const post = await Post.findById(req.params.id);
        if (!post) {
            res.status(403).json({ message: "Post not found" });
        }
        console.log(post.userId, req.body.userId);
        if (post.userId === req.body.userId) {
            // deleting the post
            await post.deleteOne();
            // const path = post.src.endsWith(".mp4")
            //     ? "public/videos/" + post.src
            //     : "public/images/" + post.src;
            // await fs.unlink(path, (err) => {
            //     console.log(err);
            // });
            res.status(200).send({ message: "post had deleted successfully" });
        } else {
            res.status(403).json({ message: "you can only delete your posts" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//* Commenting a Post *\\

router.post("/comments", async (req, res) => {
    const { postId, userId, description } = req.body;

    if (!postId || !userId || !description) {
        return res
            .status(404)
            .json({ message: "Please Fill the required fields" });
    }

    try {
        // getting the post
        const post = await Post.findById(postId);
        console.log(post);
        if (!post) {
            return res.status(404).json({ message: "Post Not Found" });
        }

        // adding the comment
        await post.updateOne({
            $push: { comments: { userId, description, likes: [] } },
        });

        console.log(post);

        res.status(200).json({
            message: "comment has been added successfully!",
        });
    } catch (err) {
        console.log(err);
        res.send(500).json({ message: "Sorry some error occurred" });
    }
});

//* Like / Dislike Post *\\

router.put("/:id/like", async (req, res) => {
    try {
        // getting the post
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            // liking the posts
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).send({
                message: "the post has been liked successfully😃",
            });
        } else {
            // disliking the posts
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json({
                message: "the post has been disliked successfully",
            });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//* Staring / Un Staring Post *\\

router.put("/star/:post", async (req, res) => {
    const post = req.params.post;
    const { postId, userId } = req.body;

    console.log(postId, post);

    try {
        if (postId === post && userId) {
            // Getting the post and user
            const user = await User.findById(userId);
            const post = await Post.findById(postId);

            if (!post) {
                return res.status(400).json({ message: "post not found 😢" });
            } else if (!user) {
                return res.status(404).json({ message: "user not found 😢" });
            } else if (user.staredPosts.includes(postId)) {
                // Un staring the post
                await user.updateOne({ $pull: { staredPosts: postId } });
                return res
                    .status(200)
                    .json({ message: "post has beed un stared successfully" });
            } else if (!user.staredPosts.includes(postId)) {
                // staring the post
                await user.updateOne({ $push: { staredPosts: postId } });
                return res
                    .status(200)
                    .json({ message: "post has beed stared successfully" });
            }
        } else {
            return res.status(400).json({ message: "post is not matching!" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "sorry error occurred 😥" });
    }
});

//* Get Popular Post *\\

router.get("/popular", async (req, res) => {
    try {
        const posts = await Post.find({}).sort({ likes: -1 }).limit(10);
        res.status(200).json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

//* Getting Stared Posts *\\

router.get("/stared/:userId", async (req, res) => {
    const userId = req.params.userId;

    console.log(userId);

    try {
        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }
        // getting the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "user is not found" });
        }
        let staredPosts = [];
        if (!user.staredPosts.length == 0) {
            // looping through all the stared post Id and getting the post
            staredPosts = await Promise.all(
                user.staredPosts.map((postId) => {
                    return Post.findById(postId);
                })
            );
        }
        return res.status(200).json(staredPosts);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "sorry error occurred 😥" });
    }
});

//* Get Post by query *\\

router.get("/query", async (req, res) => {
    const query = req.query.q;

    try {
        if (query) {
            // querying the post using regex
            const users = await Post.find({ description: { $regex: query } });
            res.status(200).json(users);
        } else {
            return res.status(400).json({ message: "no query provided" });
        }
    } catch (err) {
        return res.status(400).json({ message: err });
    }
});

//* Get Posts with Video *\\

router.get("/videos", async (req, res) => {
    try {
        // getting the post with videos
        const posts = await Post.find({ srcType: "video"});
        return res.status(200).json(posts);
    } catch (err) {
        return res.status(400).json({ message: err });
    }
});

//* Get Posts with Image *\\

router.get("/images", async (req, res) => {
    try {
        // getting the post with images
        const posts = await Post.find({ srcType: "image"});
        return res.status(200).json(posts);
    } catch (err) {
        return res.status(400).json({ message: err });
    }
});

//* Get Post *\\

router.get("/:id", async (req, res) => {
    try {
        // Getting the post
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
    res.send("hello");
});

//* Get Timeline Post *\\

router.get("/timeline/:userId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id }).sort({
            createdAt: -1,
        });

        // looping through the user following to get the their post
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId });
            })
        );
        res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

//* Get Users all Post *\\

router.get("/profile/:username", async (req, res) => {
    try {
        // Finding the post
        const user = await User.findOne({ userAddress: req.params.username });
        // Finding the user
        const posts = await Post.find({ userId: user._id }).sort({
            createdAt: -1,
        });
        res.status(200).json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;
