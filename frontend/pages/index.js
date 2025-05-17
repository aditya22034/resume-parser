import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="p-6 text-center">
        <h1 className="text-4xl font-bold">Welcome to Resume AI</h1>
        <p className="mt-4">Upload your resume and get matched with jobs powered by AI.</p>
      </main>
    </>
  );
}
