const router = require("express").Router();
const Exam = require("../models/examModel");
const authMiddleware = require("../middlewares/authMiddleware");
const User = require("../models/userModel");

// Add exam
router.post("/add", authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.body.userId);
    if (!user.isAdmin) {
      return res.status(403).send({
        message: "You are not authorized to add exams",
        success: false,
      });
    }

    const newExam = new Exam(req.body);
    await newExam.save();
    res.status(200).send({
      message: "Exam added successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// Get all exams
router.post("/get-all-exams", authMiddleware, async (req, res) => {
  try {
    const exams = await Exam.find({});
    res.status(200).send({
      message: "Exams fetched successfully",
      success: true,
      data: exams,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// Get exam by id
router.post("/get-exam-by-id", authMiddleware, async (req, res) => {
  try {
    const exam = await Exam.findById(req.body.examId);
    res.status(200).send({
      message: "Exam fetched successfully",
      success: true,
      data: exam,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// Edit exam by id
router.post("/edit-exam-by-id", authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.body.userId);
    if (!user.isAdmin) {
      return res.status(403).send({
        message: "You are not authorized to edit exams",
        success: false,
      });
    }

    await Exam.findByIdAndUpdate(req.body.examId, req.body);
    res.status(200).send({
      message: "Exam edited successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// Delete exam by id
router.post("/delete-exam-by-id", authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.body.userId);
    if (!user.isAdmin) {
      return res.status(403).send({
        message: "You are not authorized to delete exams",
        success: false,
      });
    }

    await Exam.findByIdAndDelete(req.body.examId);
    res.status(200).send({
      message: "Exam deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
