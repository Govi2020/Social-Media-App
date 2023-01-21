const router = require("express").Router();
const Message = require("../models/Message");

//* Create Conversation *\\

router.post("/", async (req, res) => {
    // creating the Conversation
    const newMessage = new Message(req.body);

    try {
        // saving the Conversation
        const savedMessage = await newMessage.save();

        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json({ message: "Sorry Some error occurred" });
    }
});

//* Get Messages *\\

router.get("/:conversationId", async(req, res) => {
    try{
        !req.params.conversationId ? res.status(400).json({ message: "please fill the fields"}) : null
        // Finding the conversations
        const conversation = await Message.find({ conversationId: req.params.conversationId})
        !conversation ? res.status(404).json({ message: "Conversation Not Found"}) : null
        res.status(200).json(conversation);
    }catch(err){
        res.status(500).json({ message: "Sorry Cant get the Messages" });
    }
});

module.exports = router;