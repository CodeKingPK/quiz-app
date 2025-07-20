const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userModel = require("./models/userModel");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL);

const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await userModel.findOne({ email: "admin@quiz.com" });
    
    if (existingAdmin) {
      console.log("❌ Admin user already exists!");
      console.log("📧 Email: admin@quiz.com");
      console.log("🔑 Password: admin123");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create admin user
    const adminUser = new userModel({
      name: "Quiz Admin",
      email: "admin@quiz.com",
      password: hashedPassword,
      isAdmin: true,
    });

    await adminUser.save();
    
    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@quiz.com");
    console.log("🔑 Password: admin123");
    console.log("🛠️  Admin Dashboard: http://localhost:3000/admin/exams");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    process.exit(1);
  }
};

createAdminUser();
