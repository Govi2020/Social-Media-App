const router = require("express").Router();
const Conversation = require("../models/Conversation");

//* Create Conversation *\\

router.post("/", async (req, res) => {
    const isExists = await Conversation.findOne({
        members: [req.body.senderId, req.body.receiverId],
    });

    console.log(isExists);

    console.log(isExists)

    if (isExists) {
        return res
            .status(200)
            .json({
                message: "Conversation already Exists",
                type: "Object Exists",
            });
    }

    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
    });

    try {
        const savedConversation = await newConversation.save();

        res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json({ message: "Sorry Some error occurred" });
    }
});

//* Get Conversation *\\

router.get("/:userId", async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in: req.params.userId },
        });
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).send({ message: "Sorry Cant get the Conversation" });
    }
});

module.exports = router;
