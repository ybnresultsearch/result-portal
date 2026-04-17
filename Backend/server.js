const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const app = express();
app.use(cors());
app.use(express.json());

// CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: "dib8rvtcu",
  api_key: "814744121851219",
  api_secret: "yU43jKdo932bjac5gvMlMJMkfPA"  // 👈 paste your full secret here
});

// CLOUDINARY STORAGE
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "results",
    resource_type: "raw",
    format: "pdf",
    type: "upload"  // 👈 this makes PDF public
  }
});

const upload = multer({ storage: storage });

// MONGODB
mongoose.connect('mongodb+srv://Sharad:Sharad123@cluster0.bazm7u4.mongodb.net/ResultPortal?retryWrites=true&w=majority&appName=Cluster0')

const Result = mongoose.model("Result", {
  name: String,
  roll: String,
  course: String,
  year: String,
  month: String,
  sem: String,
  pdf: String
});

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
      pdf: req.file.path
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

app.listen(5000, () => {
  console.log("Server running on port 5000");
});