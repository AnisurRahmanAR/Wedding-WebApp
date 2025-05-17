import { QRCode } from 'qrcode.react';
import { Link } from 'react-router-dom';

export default function QRCodePage() {
  const uploadUrl = `${window.location.origin}/upload`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-white to-blue-200 flex flex-col items-center justify-center p-6 text-center">
      <Link to="/" className="text-sm text-blue-600 hover:underline mb-4 block">← Back to Home</Link>
      <h1 className="text-3xl font-heading mb-4">📲 Scan to Upload</h1>
      <p className="mb-6 text-gray-700">Guests can scan this QR code with their phone to upload their photos and videos directly:</p>

      <div className="bg-white p-4 rounded shadow">
        <QRCode value={uploadUrl} size={256} />
        <p className="mt-4 text-xs text-gray-500">{uploadUrl}</p>
      </div>
    </div>
  );
}
