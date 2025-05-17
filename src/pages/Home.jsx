import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-white to-blue-200 flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-bold mb-4">💍 Welcome to Our Wedding!</h1>
      <p className="mb-6">Click below to upload your memories or view the gallery</p>
      <div className="flex gap-4">
        <Link to="/upload" className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600">
          Upload
        </Link>
        <Link to="/gallery" className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600">
          View Gallery
        </Link>

      </div>
    </div>
  );
}
