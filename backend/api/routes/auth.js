const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

//* handing signup request *\\
router.post("/register", async (req, res) => {
    try {

        // Seeing that the user is already registered
        const isExists = await User.findOne({ email: req.body.email });
        
        if(isExists){
            res.status(200).json({message:"User Already Exists"})
        }

        // hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // crating user address
        
        let userAddress = `@${req.body.userName}${Math.round(
            Math.random() * 10000
        )}`;
        let addressUser = await User.findOne({ userAddress: userAddress });

        console.log(addressUser);

        // keep making address until it is unique
        while (addressUser) {
            console.log(!addressUser);
            userAddress = `@${req.body.userName}${Math.round(
                Math.random() * 10000
            )}`;
            addressUser = await User.findOne({ userAddress });
            console.log(addressUser?.userAddress);
            console.log(userAddress);
        }
        console.log(userAddress);

        // creating the user


        const user = new User({
            userName: req.body.userName,
            email: req.body.email,
            password: hashedPassword,
            userAddress: userAddress,
        });
        // saving the user
        const userData = await user.save();
        res.status(200).json({...userData,message:"Registration Success Full"});
    } catch (err) {
        // handling error
        console.log(err);
        res.status(500).json({ message: "Sorry Register Failed" });
    }
});

//* handing login request *\\
router.post("/login", async (req, res) => {
    try {
        console.log("login request has started");
        const { email, password } = req?.body;

        if (!email || !password) {
            res.status(500).json({
                message: "Please enter your email and password.",
            });
        }
        // finding the user
        const user = await User.findOne({ email });
        !user && res.status(404).json({ message: "Invalid User Credentials" });

        console.log(user + " had found");

        // comparing password
        const validUser = await bcrypt.compare(password, user.password);
        !validUser && res.status(404).json({ message: "User not found" });

        console.log(validUser + " user has been checked for password");

        res.status(200).send(user);
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: err });
    }
});
module.exports = router;
