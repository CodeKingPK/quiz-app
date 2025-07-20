const express = require("express");
const app = express();
require("dotenv").config();
const dbConfig = require("./config/dbConfig");
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
const usersRoute = require("./routes/usersRoute");
const examsRoute = require("./routes/examsRoute");
const reportsRoute = require("./routes/reportsRoute");

app.use("/api/users", usersRoute);
app.use("/api/exams", examsRoute);
app.use("/api/reports", reportsRoute);

// Deployment config
const path = require("path");
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
