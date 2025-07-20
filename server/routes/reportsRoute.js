const router = require("express").Router();
const Report = require("../models/reportModel");
const authMiddleware = require("../middlewares/authMiddleware");
const Exam = require("../models/examModel");

// Add report
router.post("/add-report", authMiddleware, async (req, res) => {
  try {
    const newReport = new Report(req.body);
    await newReport.save();
    res.status(200).send({
      message: "Attempt added successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// Get all reports
router.post("/get-all-reports", authMiddleware, async (req, res) => {
  try {
    const reports = await Report.find({})
      .populate("user")
      .populate("exam")
      .sort({ createdAt: -1 });
    res.status(200).send({
      message: "Attempts fetched successfully",
      success: true,
      data: reports,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

// Get all reports by user
router.post("/get-all-reports-by-user", authMiddleware, async (req, res) => {
  try {
    const reports = await Report.find({ user: req.body.userId })
      .populate("user")
      .populate("exam")
      .sort({ createdAt: -1 });
    res.status(200).send({
      message: "Attempts fetched successfully",
      success: true,
      data: reports,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
