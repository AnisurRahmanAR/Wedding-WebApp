import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../firebaseConfig';
import { Link } from 'react-router-dom';

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [guestName, setGuestName] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    setPreviews(selectedFiles.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type
    })));
  };

  const handleUpload = async () => {
    if (!files.length) return;

    setUploading(true);
    setProgress(0);

    let completed = 0;

    await Promise.all(
      files.map(async (file) => {
        const storageRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const current = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              setProgress(Math.round(((++completed) / files.length) * 100));
            },
            (error) => {
              console.error('Upload error:', error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              await addDoc(collection(db, 'uploads'), {
                url: downloadURL,
                name: file.name,
                type: file.type,
                guestName: guestName.trim() || null,
                caption: caption.trim() || null,
                createdAt: serverTimestamp(),
              });
              resolve();
            }
          );
        });
      })
    );

    setUploading(false);
    setShowThankYou(true);
    setFiles([]);
    setPreviews([]);
    setCaption('');
    setGuestName('');
    setProgress(0);
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


      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-heading mb-6">📤 Upload Your Memories</h1>

        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Your name (optional)"
          className="mb-3 px-4 py-2 border rounded w-full font-body"
        />

        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Optional message or caption"
          rows={2}
          className="mb-4 px-4 py-2 border rounded w-full resize-none font-body"
        />

        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileChange}
          className="mb-4"
        />

        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {previews.map((p, index) => (
            <div key={index} className="max-w-xs max-h-60 overflow-hidden rounded shadow">
              {p.type.startsWith('image') ? (
                <img src={p.url} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <video src={p.url} controls className="w-full h-full object-cover" />
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading || !files.length}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full disabled:opacity-50 font-semibold"
        >
          {uploading ? `Uploading... ${progress}%` : 'Upload'}
        </button>
      </div>

      {/* Lightbox Thank You */}
      {showThankYou && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md text-center shadow-lg relative">
            <button
              onClick={() => setShowThankYou(false)}
              className="absolute top-2 right-3 text-gray-500 text-xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-heading mb-4">🎉 Thank you!</h2>
            <p className="text-gray-600 mb-4">Your memory has been uploaded.</p>
            {previews.length > 0 && (
              <div className="space-y-3">
                {previews.map((p, index) => (
                  <div key={index} className="rounded overflow-hidden">
                    {p.type.startsWith('image') ? (
                      <img src={p.url} alt="preview" className="w-full rounded" />
                    ) : (
                      <video src={p.url} controls className="w-full rounded" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
