import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { API_URL } from '../src/config';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // --- 1. Prepare Data for the Backend ---
    // The backend expects "application/x-www-form-urlencoded"
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    try {
      const response = await fetch(`${API_URL}/token`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      // --- 2. Success! Get the Token ---
      const data = await response.json();
      console.log("Login Successful:", data);

      // Save the token to browser storage
      localStorage.setItem("access_token", data.access_token);

      // Redirect to the Dashboard
      // (Make sure this matches the route path in your App.tsx!)
      navigate("/admin/dashboard");

    } catch (err) {
      setError("Invalid username or password.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-cyan-400">BioCore Admin</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Username</label>
            <input 
              type="text" 
              className="w-full bg-gray-700 rounded p-2 focus:ring-2 focus:ring-cyan-500 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-gray-700 rounded p-2 focus:ring-2 focus:ring-cyan-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button 
            type="submit" 
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded transition"
          >
            Unlock Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}