import React, { useEffect, useState } from 'react';
import axios from '../utils/axios.js';
import Navbar from './Navbar.jsx';
import Block from './Block.jsx';

export default function Uploads() {
  const [uploads, setUploads] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true); // <- loading state

  const [filters, setFilters] = useState({
    filetype: '',
    filename: '',
    minSize: '',
    maxSize: '',
    date: ''
  });

  const [sortState, setSortState] = useState({
    filename: true,
    filetype: true,
    filesize: true,
    date: true
  });

  useEffect(() => {
    async function fetchUploads() {
      try {
        const response = await axios.get('/api/getuploads', { withCredentials: true });
        if (response.status === 200) {
          setUploads(response.data.uploads);
          setFiltered(response.data.uploads);
        }
      } catch (error) {
        console.error('Error fetching uploads:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUploads();
  }, []);

  useEffect(() => {
    let temp = [...uploads];

    if (filters.filetype)
      temp = temp.filter(u => u.filetype.includes(filters.filetype));
    if (filters.filename)
      temp = temp.filter(u => u.originalname.toLowerCase().includes(filters.filename.toLowerCase()));
    if (filters.minSize)
      temp = temp.filter(u => u.filesize >= parseInt(filters.minSize));
    if (filters.maxSize)
      temp = temp.filter(u => u.filesize <= parseInt(filters.maxSize));
    if (filters.date)
      temp = temp.filter(u => new Date(u.date).toDateString() === new Date(filters.date).toDateString());

    setFiltered(temp);
  }, [filters, uploads]);

  const handleSort = (field) => {
    const isAsc = sortState[field];
    const sorted = [...filtered].sort((a, b) => {
      if (field === 'filesize') {
        return isAsc ? b.filesize - a.filesize : a.filesize - b.filesize;
      }
      if (field === 'date') {
        return isAsc
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date);
      }
      return isAsc
        ? b[field]?.localeCompare(a[field])
        : a[field]?.localeCompare(b[field]);
    });
    setFiltered(sorted);
    setSortState({ ...sortState, [field]: !isAsc });
  };

  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1 p-6 bg-[#f5f5dc] min-h-screen">
        <h1 className="text-3xl font-bold text-red-700 mb-4">Your Uploads</h1>

        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
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
            {/* Sort buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button onClick={() => handleSort('filename')} className="bg-red-500 text-white px-4 py-2 rounded">
                Sort by Name
              </button>
              <button onClick={() => handleSort('filetype')} className="bg-red-500 text-white px-4 py-2 rounded">
                Sort by Type
              </button>
              <button onClick={() => handleSort('filesize')} className="bg-red-500 text-white px-4 py-2 rounded">
                Sort by Size
              </button>
              <button onClick={() => handleSort('date')} className="bg-red-500 text-white px-4 py-2 rounded">
                Sort by Date
              </button>
            </div>

            {/* Uploads Grid */}
            {filtered.length === 0 ? (
              <p className="text-lg text-red-800">No uploads found.</p>
            ) : (
              <div className="flex flex-wrap gap-20">
                {filtered.map((upload, idx) => (
                  <Block key={idx} upload={upload} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
