import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function fetchJobs() {
      const res = await fetch('http://localhost:5000/api/jobs/match/USER_ID');
      const data = await res.json();
      setJobs(data);
    }

    fetchJobs();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Recommended Jobs</h2>
        <ul>
          {jobs.map((job, i) => (
            <li key={i} className="border p-4 rounded mb-3">
              <h3 className="text-xl font-semibold">{job.title} ({job.matchScore}%)</h3>
              <p>{job.company} - {job.location}</p>
              <p className="mt-2 text-sm">{job.description}</p>
              <a href={job.url} className="text-blue-600 underline mt-2 block" target="_blank" rel="noopener noreferrer">
                View Job
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
