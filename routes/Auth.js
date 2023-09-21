const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const router = express.Router();
const USER = mongoose.model("USERS");
const jwt = require("jsonwebtoken");
const jwt_secret = require("../jwt");
const Login = require("../middleware/Login");


router.post("/signup", async (req, res) => {
    const { name, username, email, password } = req.body;

    try {
        if (!name || !username || !email || !password) {
            throw new Error("All fields are required");
        }

        const existingEmail = await USER.findOne({ email });
        const existingUsername = await USER.findOne({ username });

        if (existingEmail) {
            throw new Error("Email is already registered");
        }

        if (existingUsername) {
            throw new Error("Username is already taken");
        }

        const saltRounds = 12;
        const hash = await bcrypt.hash(password, saltRounds);

        const user = new USER({
            name,
            username,
            email,
            password: hash
        });

        await user.save();
        res.json({ message: "DATA SAVED OK" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error occurred while saving data" });
    }
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            throw new Error("All fields are required");
        }

        const savedUser = await USER.findOne({ email: email });
        if (!savedUser) {
            throw new Error("Invalid Error");
        }

        const match = await bcrypt.compare(password, savedUser.password);
        if (match) {
            const token = jwt.sign({ _id: savedUser._id }, jwt_secret);
            const { _id, name, email, username } = savedUser;
            res.json({ token: token, user: { _id, name, email, username } });
            console.log(token);
        } else {
            throw new Error("Signin not successful");
        }
    } catch (error) {
        console.log(error);
        res.status(422).json({ error: error.message });
    }
});



router.post("/forgot-password", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
  
      const user = await USER.findOne({ email });
  
      if (!user) {
        throw new Error("User not found with this email");
      }
  
    
      const saltRounds = 12;
      const hash = await bcrypt.hash(password, saltRounds);
      user.password = hash;
  
      await user.save();
  
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
