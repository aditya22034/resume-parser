// ResumeUpload.jsx
import React, { useState } from "react";
import axios from "axios";

const ResumeUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("");
  const [score, setScore] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setStatus("");
    setScore(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatus("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      setStatus("Uploading...");
      const response = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setScore(response.data.score);
      setStatus("Resume uploaded and analyzed successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      setStatus("Upload failed. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Resume Analyzer</h2>
      <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
      <br />
      <button onClick={handleUpload} style={{ marginTop: "20px" }}>
        Upload Resume
      </button>
      <p>{status}</p>
      {score !== null && <h3>Your Resume Score: {score}</h3>}
    </div>
  );
};

export default ResumeUpload;
