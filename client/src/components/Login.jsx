import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { GoogleLogin } from '@react-oauth/google';
export default function Login() {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const navigate = useNavigate();
  const handleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
      const res = await axios.post('/api/google-auth', { token }, { withCredentials: true });

      if (res.status === 200) {
        window.location.href = '/home';
      }
    } catch (err) {
      console.error('Google login failed:', err);
      alert('Authentication failed');
    }
  };
  async function handle(e) {
    e.preventDefault();
    try {
      const response = await axios.post('/api/login', { email, password });
      if (response.status === 200) {
        console.log('success');
        navigate('/home');
      }
    } catch (error) {
      if (error.response?.status === 400) {
        console.log(error.response.data);
        navigate('/login');
      } else {
        alert('Something went wrong');
        navigate('/');
      }
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/assets/cloud.png')" }}
    >
      <div className="bg-[#F8F2DE]/80 p-8 rounded-xl shadow-lg w-full max-w-md text-[#D84040]">
        <h2 className="text-3xl font-bold mb-6 text-center">Login to DocNest</h2>

        <form onSubmit={handle} className="flex flex-col gap-4">
          <input
            type="text"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            className="px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            className="px-4 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          />
          <button
            type="submit"
            className="bg-[#D84040] text-white px-4 py-2 rounded-lg hover:bg-[#b73030] transition"
          >
            Login
          </button>
        </form>
        <GoogleLogin onSuccess={handleSuccess} onError={() => alert('Login Failed')} />
        <p className="mt-4 text-sm text-center text-[#6B1D1D]">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="underline cursor-pointer hover:text-red-700"
          >
            Sign up
          </span>
        </p>

      </div>
    </div>
  );
}
