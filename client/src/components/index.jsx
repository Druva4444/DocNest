import React,{useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    const cookies = document.cookie.split(';').map(c => c.trim());
    const uidCookie = cookies.find(c => c.startsWith('uid='));

    if (uidCookie) {
      navigate('/home');
    }
  }, [navigate]);
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center text-[#D84040] font-sans px-4"
      style={{ backgroundImage: "url('/assets/cloud.png')" }}

    >
      {/* Overlay for contrast */}
      <div className="bg-[#F8F2DE]/80 p-10 rounded-xl shadow-lg text-center">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to <span className="text-[#D84040]">DocNest</span>
        </h1>
        <p className="text-lg max-w-xl mb-8 text-[#6B1D1D]">
          Securely upload, store, and manage your <strong>documents, images</strong>, and <strong>videos</strong> all in one place.
        </p>

        <div className="flex justify-center gap-6">
          <button
            onClick={() => window.location.href = "/login"}
            className="bg-[#D84040] text-white px-6 py-2 rounded-lg shadow-md hover:bg-[#b73030] transition"
          >
            Login
          </button>
          <button
            onClick={() => window.location.href = "/signup"}
            className="bg-white text-[#D84040] border border-[#D84040] px-6 py-2 rounded-lg shadow-md hover:bg-[#f8e5e5] transition"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-sm text-[#C35656]">
        © 2025 DocNest — Store with Trust.
      </footer>
    </div>
  );
}
