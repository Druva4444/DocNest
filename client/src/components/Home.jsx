import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import Navbar from './Navbar';

export default function Home() {
  const [user, setUser] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true); // loading state

  const formatSize = (bytes) => {
    if (bytes > 1e9) return (bytes / 1e9).toFixed(2) + ' GB';
    if (bytes > 1e6) return (bytes / 1e6).toFixed(2) + ' MB';
    if (bytes > 1e3) return (bytes / 1e3).toFixed(2) + ' KB';
    return bytes + ' B';
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [uploadRes, userRes] = await Promise.all([
          axios.get('/api/getuploads', { withCredentials: true }),
          axios.get('/api/getuser', { withCredentials: true }),
        ]);
        if (userRes.status === 200) setUser(userRes.data.user);
        if (uploadRes.status === 200) setUploads(uploadRes.data.uploads);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    console.log(user)
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert('Please select a file.');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploading(true);
      setAlert(null);
      const res = await axios.post('/api/upload', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.status === 200) {
        setSelectedFile(null);
        setAlert({ type: 'success', message: 'File uploaded successfully!' });

        const [userRes, uploadsRes] = await Promise.all([
          axios.get('/api/getuser', { withCredentials: true }),
          axios.get('/api/getuploads', { withCredentials: true }),
        ]);
        if (userRes.status === 200) setUser(userRes.data.user);
        if (uploadsRes.status === 200) setUploads(uploadsRes.data.uploads);
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: 'Upload failed. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const used = user?.usedcapacity ?? 100;
  const max = user?.plan.capacity || (user?.plan.name === 'platinum' ? 1e9 : 1e8);
  let rawPercent = (used / max) * 100;
  const usagePercent = rawPercent > 0 && rawPercent < 0.01 ? 0.01 : rawPercent.toFixed(2);

  const getColor = () => {
    if (usagePercent < 50) return 'stroke-green-500';
    if (usagePercent < 80) return 'stroke-yellow-400';
    return 'stroke-red-600';
  };

  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1 p-10 bg-[#f5f5dc] min-h-screen">
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <svg className="animate-spin h-10 w-10 text-red-600" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
              />
            </svg>
          </div>
        ) : (
          <>
            <h1 className="text-4xl text-red-700 font-bold mb-10">
              Welcome, {user?.name || 'User'}
            </h1>

            {/* Alert */}
            {alert && (
              <div
                className={`mb-6 px-4 py-3 rounded ${
                  alert.type === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                }`}
              >
                {alert.message}
              </div>
            )}

            {/* Top Overview */}
            <div className="flex flex-col lg:flex-row gap-10 items-start justify-start">
              {/* Circular Disk */}
              <div className="relative w-64 h-64">
                <svg className="w-full h-full">
                  <circle cx="128" cy="128" r="100" className="stroke-gray-300" strokeWidth="18" fill="none" />
                  <circle
                    cx="128"
                    cy="128"
                    r="100"
                    className={`transition-all duration-700 ${getColor()}`}
                    strokeWidth="18"
                    fill="none"
                    strokeDasharray="628"
                    strokeDashoffset={628 - (628 * usagePercent) / 100}
                    transform="rotate(-90 128 128)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-red-700">{usagePercent}%</span>
                  <span className="text-sm text-gray-600 mt-1">Storage Used</span>
                  <span className="text-xs mt-1 text-gray-700">
                    {formatSize(used)} / {formatSize(max)}
                  </span>
                </div>
              </div>

              {/* Info Cards */}
              <div className="flex flex-col gap-6 w-full max-w-md">
                <div className="bg-white rounded-xl shadow-lg border-l-8 border-red-600 p-6 hover:shadow-xl transition">
                  <h2 className="text-xl text-red-700 font-semibold">Total Uploads</h2>
                  <p className="text-3xl mt-2">{uploads.length}</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg border-l-8 border-red-600 p-6 hover:shadow-xl transition">
                  <h2 className="text-xl text-red-700 font-semibold">Current Plan</h2>
                  <p className="text-2xl mt-2 capitalize">{user.plan.name || 'free'}</p>
                  {user?.plan.name === 'free' && (
                    <button className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                      Upgrade Plan
                    </button>
                  )}
                </div>
              </div>

              {/* Upload Card */}
              <div className="bg-white rounded-xl shadow-lg border-l-8 border-red-600 p-6 w-full max-w-md hover:shadow-xl transition flex flex-col gap-4">
                <h2 className="text-xl text-red-700 font-semibold">Upload File</h2>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-700 border border-red-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400"
                />
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className={`px-4 py-2 text-white rounded transition ${
                    uploading ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
                        />
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    'Upload'
                  )}
                </button>
              </div>
            </div>

            {/* Recent Uploads */}
            <h2 className="text-2xl text-red-700 font-semibold mt-16 mb-4">Recent Uploads</h2>
            {uploads.length === 0 ? (
              <p className="text-gray-600 italic">No uploads found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[...uploads]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 6)
                  .map((upload, idx) => (
                    <div
                      key={idx}
                      onClick={async () => {
                        try {
                          const res = await axios.post(
                            '/api/geturl',
                            { filename: upload.filename },
                            { withCredentials: true }
                          );
                          if (res.status === 200 && res.data?.url) {
                            window.open(res.data.url, '_blank');
                          } else {
                            alert('Failed to get file URL.');
                          }
                        } catch (err) {
                          console.error(err);
                          alert('Error fetching file.');
                        }
                      }}
                      className="bg-white p-4 rounded-xl shadow border border-red-300 cursor-pointer hover:shadow-lg transition"
                    >
                      <p className="font-semibold text-red-600 truncate">{upload.originalname}</p>
                      <p className="text-sm text-gray-600">{(upload.filesize / 1024).toFixed(1)} KB</p>
                      <p className="text-xs text-gray-500">{new Date(upload.date).toLocaleDateString()}</p>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
