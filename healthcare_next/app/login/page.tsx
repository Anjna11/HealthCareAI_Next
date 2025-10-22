'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
  
    try {
      const res = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }) // converts JavaScript object into JSON string
      }); 
  
      const data = await res.json();
  
      if (data.success) {
        setMessage("Login successful");
      } else {
        setMessage("Invalid email or password");
      }
  
    } catch (error) {
      console.error(error);
      setMessage('Error connecting to server');
    }
  };  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800">Dhanomi - HealthCare</h2>
        <h2 className="text-xl font-bold text-center text-gray-800">Login</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className='w-full'>
            Login
          </Button>
        </form>

        {message && <p className="mt-4 text-center text-green-500">{message}</p>}
      </div>
    </div>
  );
}
