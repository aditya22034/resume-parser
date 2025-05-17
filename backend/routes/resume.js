const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const natural = require('natural');
const mongoose = require('mongoose');
const Resume = require('../models/Resumee');
const parsePDF = require('../utils/parsePDF');
const parseDOCX = require('../utils/parseDOCX');

const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('resume'), async (req, res) => {
  const { name } = req.body;
  const file = req.file;

  try {
    let text = '';

    if (file.mimetype === 'application/pdf') {
      text = await parsePDF(file.path);
    } else if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      text = await parseDOCX(file.path);
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    // Basic NLP: split text into keywords
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(text.toLowerCase());

    // Basic keyword matching (simplified logic)
    const skills = ['javascript', 'react', 'python', 'node', 'java', 'sql'];
    const matchedSkills = skills.filter(skill => tokens.includes(skill));

    const resume = new Resume({
      name,
      text,
      skills: matchedSkills,
      education: [], // Placeholder
      experience: [], // Placeholder
    });

    await resume.save();

    res.json({ message: 'Resume processed', skills: matchedSkills });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process resume' });
  }
});

module.exports = router;
