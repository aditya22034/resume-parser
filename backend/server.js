const express = require('express');       
const mongoose = require('mongoose');     
const cors = require('cors');             
const jobRoutes = require('./routes/Jobs');

const app = express();  
app.use(cors()); 
const resumeRoutes = require('./routes/resume'); 
app.use('/api/resume', resumeRoutes);                


app.use(express.json());

app.use('/api/jobs', jobRoutes);

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/resume-ai', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(' MongoDB Connected'))
.catch(err => console.error(' MongoDB Error:', err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
