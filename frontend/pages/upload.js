import Navbar from '../components/Navbar';
import { useState } from 'react';

export default function Upload() {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('resume', file);

    const res = await fetch('http://localhost:5000/api/resume/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    alert(`Resume uploaded! Skills found: ${data.skills.join(', ')}`);
  };

  return (
    <>
      <Navbar />
      <form onSubmit={handleSubmit} className="p-6 max-w-xl mx-auto" encType="multipart/form-data">
        <h2 className="text-2xl font-semibold mb-4">Upload Your Resume</h2>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 w-full mb-4"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>
    </>
  );
}
