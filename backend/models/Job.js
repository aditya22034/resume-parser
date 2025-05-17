const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  description: String,
  skills: [String],
  url: String
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
