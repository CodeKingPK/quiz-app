const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");

// Register user
router.post("/register", async (req, res) => {
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(200).send({
        message: "User already exists",
        success: false,
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    // Create user
    const newUser = new User(req.body);
    await newUser.save();
    res.status(200).send({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).send({
        message: "User does not exist",
        success: false,
      });
    }

    // Check password
    const passwordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!passwordCorrect) {
      return res.status(200).send({
        message: "Invalid password",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({
      message: "User logged in successfully",
      success: true,
      data: token,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// Get user info
router.post("/get-user-info", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    res.status(200).send({
      message: "User info fetched successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
