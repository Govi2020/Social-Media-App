const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const e = require("express");

//* update user *\\
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        console.log(req.body.password);
        if (req.body.password) {
            try {
                console.log("password");
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                res.status(403).json({ message: err });
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            console.log(user);
            res.status(200).json({ message: "Account updated successfully" });
        } catch (err) {
            res.status(403).json({ message: err });
        }
    } else {
        res.status(403).json({ message: "you can only update your profile" });
    }
});

//* delete user *\\
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        console.log(req.body.password);
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            console.log(user);
            res.status(200).json({ message: "Account deleted successfully" });
        } catch (err) {
            res.status(403).json({ message: err });
        }
    } else {
        res.status(403).json({ message: "you can only delete your profile" });
    }
});

//* getting the user *\\
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const userName = req.query.userName;
    
    try {
        const user = userId
            ? await User.findById(userId, {
                isAdmin: 0,
                password: 0,
            })
            : await User.findOne({ userAddress : userName },{
                isAdmin: 0,
                password: 0,
            });
        if (user) {
            console.log(user)
            res.status(200).json(user);
        } else {
            res.status(400).send({ message: "User not found" });
        }
    } catch (err) {
        res.status(400).send({ message: err });
    }
});

//* Getting and Filtering users *\\

router.get("/query", async (req, res) => {
    const query = req.query.q;

    try {
        if (query){
            console.log(query)
            const users = await User.find({userName: {$regex: query}});
            res.status(200).json(users);
        }else{
            res.status(500).json({message: "no query provided"})
        }
    }catch (err) {
        res.status(400).json({message: err})
    }
});

//* getting Friends of the user *\\
router.get("/friends/:userId", async (req, res) => {
    try {
        const nonWantedList = {
            isAdmin: 0,
            password: 0,
            followings: 0,
            followers: 0,
            email: 0,
            coverPicture: 0,
            description: 0,
            city: 0,
            from: 0,
            relationship: 0,
        };

        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followings.map((friendId) => {
                return User.findById(friendId, nonWantedList);
            })
        );
        if (user && friends) {
            res.status(200).json(friends);
        } else {
            res.status(400).send({ message: "User or friends not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: err });
    }
});

//* getting Followers of the user *\\
router.get("/followers/:userId", async (req, res) => {
    try {
        const nonWantedList = {
            isAdmin: 0,
            password: 0,
            followings: 0,
            followers: 0,
            email: 0,
            coverPicture: 0,
            description: 0,
            city: 0,
            from: 0,
            relationship: 0,
        };

        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followers.map((friendId) => {
                return User.findById(friendId, nonWantedList);
            })
        );
        if (user && friends) {
            res.status(200).json(friends);
        } else {
            res.status(400).send({ message: "User or friends not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(400).send({ message: err });
    }
});

//* Follow the user *\\
router.put("/:id/follow", async (req, res) => {
    try {
        if (req.body.userId !== req.params.id) {
            const targetedUser = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if (!targetedUser.followers.includes(req.body.userId)) {
                await targetedUser.updateOne({
                    $push: { followers: req.body.userId },
                });
                console.log(targetedUser);
                await currentUser.updateOne({
                    $push: { followings: req.params.id },
                });
                res.status(200).json({ message: "User followed successfully" });
            } else {
                res.status(403).json({
                    message: "you already follow this user",
                });
            }
        } else {
            res.status(500).json({ message: "you can't follow yourself" });
        }
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

//* UnFollow the user *\\

router.put("/:id/unfollow", async (req, res) => {
    try {
        if (req.body.userId !== req.params.id) {
            const targetedUser = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if (targetedUser.followers.includes(req.body.userId)) {
                await targetedUser.updateOne({
                    $pull: { followers: req.body.userId },
                });
                console.log(targetedUser);
                await currentUser.updateOne({
                    $pull: { followings: req.params.id },
                });
                res.status(200).json({
                    message: "User unfollowed successfully",
                });
            } else {
                res.status(403).json({ message: "you don't follow this user" });
            }
        } else {
            res.status(500).json({ message: "you can't unfollow yourself" });
        }
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

module.exports = router;
