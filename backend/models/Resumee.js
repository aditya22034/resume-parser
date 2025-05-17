const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  name: String,
  text: String,
  skills: [String],
  education: [String],
  experience: [String],
}, { timestamps: true });

module.exports = mongoose.model('Resumee', ResumeSchema);
