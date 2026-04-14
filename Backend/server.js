const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// SERVE UPLOADS FOLDER
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ CONNECT MONGODB ATLAS
mongoose.connect('mongodb+srv://Sharad:Sharad123@cluster0.bazm7u4.mongodb.net/ResultPortal?retryWrites=true&w=majority&appName=Cluster0', {
  serverSelectionTimeoutMS: 10000,
  family: 4
})

// SCHEMA
const Result = mongoose.model("Result", {
  name: String,
  roll: String,
  course: String,
  year: String,
  month: String,
  sem: String,
  pdf: String
});

// FILE UPLOAD SETTINGS
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".pdf");
  }
});

const upload = multer({ storage: storage });

// UPLOAD ROUTE
app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const result = new Result({
      name: req.body.name,
      roll: req.body.roll,
      course: req.body.course,
      year: req.body.year,
      month: req.body.month,
      sem: req.body.sem,
      pdf: `http://localhost:5000/uploads/${req.file.filename}`
    });

    await result.save();

    res.send("Uploaded Successfully");
  } catch (err) {
    console.log(err);
    res.send("Upload Failed");
  }
});

// SEARCH ROUTE
app.get("/result/:roll", async (req, res) => {
  const data = await Result.findOne({ roll: req.params.roll });

  if (data) {
    res.json({ success: true, result: data });
  } else {
    res.json({ success: false });
  }
});

// START SERVER
app.listen(5000, () => {
  console.log("Server running on port 5000");
});