import React, { useState, useEffect } from 'react';
import imageIcon from '/assets/image.jpg';
import musicIcon from '/assets/music.jpg';
import pdfIcon from '/assets/pdf.jpg';
import videoIcon from '/assets/video.png';
import axios from '../utils/axios';
import { Trash2, Loader2 } from 'lucide-react'; // Lucide icons

export default function Block(props) {
  const [icon, setIcon] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const type = props.upload.filetype;
    if (type.startsWith('image/')) setIcon(imageIcon);
    else if (type.startsWith('audio/')) setIcon(musicIcon);
    else if (type.startsWith('video/')) setIcon(videoIcon);
    else setIcon(pdfIcon);
  }, [props.upload.filetype]);

  const handleClick = async () => {
    if (deleting) return; // Prevent open while deleting
    try {
      const res = await axios.post(
        '/api/geturl',
        { filename: props.upload.filename },
        { withCredentials: true }
      );
      if (res.status === 200 && res.data?.url) {
        window.open(res.data.url, '_blank');
      } else {
        alert('Failed to retrieve file URL');
      }
    } catch (err) {
      console.error('Error getting file URL:', err);
      alert('Error retrieving file');
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation(); // prevent click propagation
    const confirmed = window.confirm(`Delete ${props.upload.originalname}?`);
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await axios.delete(`/api/delete/${props.upload._id}`, { withCredentials: true });
      if (res.status === 200) {
        props.onDelete?.(props.upload._id);
      } else {
        alert('Failed to delete');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="w-40 relative text-center cursor-pointer" onClick={handleClick}>
      {/* Deleting overlay */}
      {deleting && (
        <div className="absolute inset-0 bg-white/70 z-20 flex items-center justify-center rounded-lg">
          <Loader2 className="animate-spin text-red-600" size={24} />
        </div>
      )}

      {/* Delete button */}
      <div
        className="absolute top-1 right-1 bg-white rounded-full p-1 hover:bg-red-100 z-10"
        onClick={deleting ? null : handleDelete}
      >
        <Trash2 size={16} className="text-red-500 hover:text-red-700" />
      </div>

      <img
        src={icon}
        alt={`${props.upload.originalname} thumbnail`}
        className="w-full h-32 object-cover rounded-lg shadow-md"
      />
      <p className="mt-2 text-sm break-words">{props.upload.originalname}</p>
    </div>
  );
}
