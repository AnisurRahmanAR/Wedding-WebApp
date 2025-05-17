import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Link } from 'react-router-dom';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function Gallery() {
  const [uploads, setUploads] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUploads = async () => {
      const q = query(collection(db, 'uploads'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => doc.data());
      setUploads(data);
      setLoading(false);
    };

    fetchUploads();
  }, []);

  const handleBulkDownload = async () => {
    const zip = new JSZip();
    const folder = zip.folder('wedding-uploads');

    for (let i = 0; i < uploads.length; i++) {
      const file = uploads[i];
      try {
        const response = await fetch(file.url);
        const blob = await response.blob();
        folder.file(file.name || `file-${i}`, blob);
      } catch (error) {
        console.error('Failed to fetch:', file.url);
      }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, 'wedding-uploads.zip');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-white to-blue-200 p-6">
      <Link
        to="/"
        className="md:fixed md:top-6 md:left-6 z-50 animate-fade-in inline-flex items-center gap-2 bg-white text-blue-600 border border-blue-300 hover:bg-blue-50 hover:border-blue-500 font-medium px-4 py-2 rounded-full shadow transition mb-4"
      >
        <span className="text-lg">←</span>
        Home
      </Link>

      <h1 className="text-4xl font-heading text-center mb-8">🖼️ Guest Gallery</h1>

      <div className="text-center mb-6">
        <button
          onClick={handleBulkDownload}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          ⬇ Download All Uploads
        </button>
      </div>


      {loading && <p className="text-center text-gray-500">Loading gallery...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {uploads.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition transform"
            onClick={() => setSelected(item)}
          >
            {item.type?.startsWith('image') ? (
              <img src={item.url} alt={item.name} className="w-full h-60 object-cover" />
            ) : (
              <video src={item.url} className="w-full h-60 object-cover" />
            )}
            <div className="p-3 text-center space-y-1">
              {item.guestName && (
                <p className="text-sm font-semibold text-pink-700">{item.guestName}</p>
              )}
              {item.caption && (
                <p className="text-xs italic text-gray-500">“{item.caption}”</p>
              )}
              {item.createdAt && (
                <p className="text-xs text-gray-400">
                  {new Date(item.createdAt.seconds * 1000).toLocaleString()}
                </p>
              )}
              <a
                href={item.url}
                download
                className="inline-block mt-1 text-blue-500 hover:underline text-xs"
              >
                ⬇ Download
              </a>
            </div>
          </div>
        ))}
      </div>

      {!loading && uploads.length === 0 && (
        <p className="text-center text-gray-600 mt-10">No uploads yet. Be the first to share!</p>
      )}

      {/* Lightbox Overlay */}
      {selected && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <div className="relative max-w-screen-md w-full p-4 bg-white rounded-xl shadow-lg">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-4 text-gray-600 text-2xl font-bold"
            >
              &times;
            </button>

            {selected.type?.startsWith('image') ? (
              <img src={selected.url} alt={selected.name} className="w-full rounded-lg" />
            ) : (
              <video
                src={selected.url}
                controls
                autoPlay
                className="w-full rounded-lg"
              />
            )}

            <div className="text-center mt-4">
              {selected.guestName && (
                <p className="text-base font-semibold text-pink-700">{selected.guestName}</p>
              )}
              {selected.caption && (
                <p className="text-sm italic text-gray-600 mt-1">“{selected.caption}”</p>
              )}
              {selected.createdAt && (
                <p className="text-xs text-gray-400 mt-1">
                  Uploaded on {new Date(selected.createdAt.seconds * 1000).toLocaleString()}
                </p>
              )}
              <a
                href={selected.url}
                download
                className="inline-block mt-2 text-blue-500 hover:underline text-sm"
              >
                ⬇ Download File
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
