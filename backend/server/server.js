// server.js
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 5000;

// Enable CORS so your React frontend (usually on localhost:5173) can call this API
app.use(cors());

// Make sure uploads folder exists or create it
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Setup multer for file upload, saving files to uploads folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Save file with original name + timestamp to avoid conflicts
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// POST /api/upload to receive the resume file
app.post("/api/upload", upload.single("resume"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  console.log("File received:", req.file.path);

  // Here you can do your analysis or call external API for scoring

  // For now, respond with a dummy score
  const dummyScore = Math.floor(Math.random() * 100) + 1;

  res.json({
    message: "File uploaded successfully",
    score: dummyScore,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
