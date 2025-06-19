import React, { useEffect, useState } from 'react';
import axios from '../utils/axios.js';
import Navbar from './Navbar.jsx';
import Block from './Block.jsx';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [uploads, setUploads] = useState([]);

  useEffect(() => {
    async function fetchUploads() {
      try {
        const response = await axios.get('/api/getuploads', { withCredentials: true });
        if (response.status === 200) {
          setUploads(response.data.uploads);
        }
      } catch (err) {
        console.error("Failed to fetch uploads", err);
      }
    }
    fetchUploads();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        alert("Upload successful!");
        setUploads(prev => [...prev, response.data.newUpload || { 
          originalname: file.name, 
          filetype: file.type, 
          filesize: file.size,
          createdAt: new Date().toISOString()
        }]);
        setFile(null);
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed: " + (err.response?.data?.message || err.message));
    }
  }

  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1 p-6 bg-[#f5f5dc] min-h-screen">
        <h1 className="text-3xl font-bold text-red-700 mb-6">Upload a File</h1>

        <form onSubmit={handleSubmit} className="flex items-center gap-4 mb-8">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 bg-white rounded"
          />
          <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">
            Upload
          </button>
        </form>

        <h2 className="text-xl font-semibold text-red-700 mb-4">Uploaded Files</h2>
        {uploads.length === 0 ? (
          <p className="text-red-800">No uploads yet.</p>
        ) : (
          <div className="flex flex-wrap gap-10">
            {uploads.map((upload, idx) => (
              <Block key={idx} upload={upload} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
