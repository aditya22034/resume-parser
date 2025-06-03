import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import fetch from "node-fetch";
import * as fsSync from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fsSync.existsSync(uploadsDir)) {
  fsSync.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

async function getResumeScore(text) {
  const prompt = `
Please analyze the following resume and return a score (0–100) evaluating the resume quality. Respond with ONLY the number.

Resume:
${text}
  `;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "phi4-mini",  // Change this to your actual model name
        prompt,
        stream: false,
      }),
    });

    const data = await response.json();
    const output = data.response.trim();
    const score = parseInt(output, 10);

    if (isNaN(score)) {
      console.warn("Couldn't parse score:", output);
      return null;
    }

    return score;
  } catch (err) {
    console.error("Error calling Ollama:", err);
    return null;
  }
}

app.post("/api/upload", upload.single("resume"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  try {
    const resumeText = await fs.readFile(req.file.path, "utf8");
    // console.log(resumeText)

    const score = await getResumeScore(resumeText);
    console.log(score)

    if (score === null) {
      return res.status(500).json({ error: "Failed to compute score" });
    }

    res.json({ message: "Resume analyzed", score });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    res.status(500).json({ error: "Failed to process resume" });
  }
});

app.listen(PORT, () => {
  console.log(PORT)
  console.log(`Server running at http://localhost:${PORT}`);
});
// import express from "express";
// import cors from "cors";
// import multer from "multer";
// import path from "path";
// import fs from "fs/promises";
// import fetch from "node-fetch";
// import * as fsSync from "fs";
// import { fileURLToPath } from "url";
// import { dirname } from "path";
// import pdfParse from "pdf-parse";  // ✅ Add this line to extract text from PDF

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const app = express();
// const PORT = 5000;

// app.use(cors());

// const uploadsDir = path.join(__dirname, "uploads");
// if (!fsSync.existsSync(uploadsDir)) {
//   fsSync.mkdirSync(uploadsDir);
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadsDir),
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage });

// async function getResumeScore(text) {
//   const prompt = `
// Please analyze the following resume and return a score (0–100) evaluating the resume quality. Respond with ONLY the number.

// Resume:
// ${text}
//   `;

//   try {
//     const response = await fetch("http://localhost:11434/api/generate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         model: "phi4-mini",  // Your model name in Ollama
//         prompt,
//         stream: false,
//       }),
//     });

//     const data = await response.json();
//     const output = data.response.trim();
//     const score = parseInt(output, 10);

//     if (isNaN(score)) {
//       console.warn("Couldn't parse score:", output);
//       return null;
//     }

//     return score;
//   } catch (err) {
//     console.error("Error calling Ollama:", err);
//     return null;
//   }
// }

// app.post("/api/upload", upload.single("resume"), async (req, res) => {
//   if (!req.file) return res.status(400).json({ error: "No file uploaded" });

//   try {
//     const pdfBuffer = await fs.readFile(req.file.path);      // ✅ Read as binary
//     const parsedData = await pdfParse(pdfBuffer);            // ✅ Extract text
//     const resumeText = parsedData.text;

//     const score = await getResumeScore(resumeText);
//     console.log("Score:", score);

//     if (score === null) {
//       return res.status(500).json({ error: "Failed to compute score" });
//     }

//     res.json({ message: "Resume analyzed", score });
//   } catch (error) {
//     console.error("Error analyzing resume:", error);
//     res.status(500).json({ error: "Failed to process resume" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`✅ Server running at http://localhost:${PORT}`);
// });
