const express = require('express');
const router = express.Router();
const Job = require('../models/job');
const scrapeJobs = require('../utils/scrapeJobs');
const stringSimilarity = require('string-similarity');

// Scrape and save jobs
router.get('/scrape', async (req, res) => {
  try {
    const scrapedJobs = await scrapeJobs('software engineer');
    const jobsWithSkills = scrapedJobs.map(job => ({
      ...job,
      skills: extractSkills(job.description)
    }));

    await Job.insertMany(jobsWithSkills);
    res.json({ message: 'Jobs scraped and saved', count: jobsWithSkills.length });
  } catch (err) {
    res.status(500).json({ error: 'Job scraping failed' });
  }
});

// Return matching jobs based on user skills
router.get('/match/:userId', async (req, res) => {
  const Resume = require('../models/Resumee');
  try {
    const resume = await Resume.findById(req.params.userId);
    const jobs = await Job.find();

    const matched = jobs.map(job => {
      const matchScore = stringSimilarity.compareTwoStrings(
        resume.skills.join(' '),
        job.skills.join(' ')
      );

      return { ...job._doc, matchScore: (matchScore * 100).toFixed(1) };
    });

    res.json(matched.sort((a, b) => b.matchScore - a.matchScore).slice(0, 10));
  } catch (err) {
    res.status(500).json({ error: 'Failed to match jobs' });
  }
});

function extractSkills(text) {
  const skills = ['javascript', 'python', 'react', 'node', 'sql', 'aws', 'docker'];
  const lowerText = text.toLowerCase();
  return skills.filter(skill => lowerText.includes(skill));
}

module.exports = router;
