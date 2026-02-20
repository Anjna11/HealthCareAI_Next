'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HeartPulse } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('Login successful!');
        setTimeout(() => {
          router.push('/home');
        }, 800);
      } else {
        setMessage('Invalid email or password');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error connecting to server');
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white relative overflow-hidden">

      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 items-center justify-center p-16 relative z-10">
        <div className="max-w-lg">
          <motion.h2
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold leading-tight"
          >
            Healing the Future with Intelligence
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 text-lg leading-relaxed space-y-4"
          >
            At <span className="text-white font-semibold">Dhanomi HealthCare.AI</span>, 
            innovation meets empathy.
            <br /><br />
            We blend advanced artificial intelligence with human insight to empower 
            doctors, enhance patient outcomes, and redefine personalized care.
            <br /><br />
            Smarter diagnostics. Seamless connections.
            <br />
            Compassion, reimagined through technology.
          </motion.p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-10 py-16 relative z-10">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-10"
        >
          <HeartPulse className="w-7 h-7 text-[#F87B1B]" />
          <h1 className="text-3xl font-bold tracking-wide">
            DHANOMI
          </h1>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-[#111111] border border-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl"
        >
          <h2 className="text-2xl font-semibold mb-2">Welcome Back</h2>
          <p className="text-white/60 text-sm mb-8">
            Please enter your login details to continue.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-sm text-white/70 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 
                bg-[#0d0d0d] 
                border border-white/10 
                rounded-lg 
                text-white 
                placeholder-white/30
                focus:outline-none 
                focus:border-white 
                focus:ring-1 
                focus:ring-white/40
                transition-all duration-300"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-white/70 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 
                bg-[#0d0d0d] 
                border border-white/10 
                rounded-lg 
                text-white 
                placeholder-white/30
                focus:outline-none 
                focus:border-white 
                focus:ring-1 
                focus:ring-white/40
                transition-all duration-300"
              />
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm text-white/60">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-white" />
                Remember me
              </label>
              <a href="#" className="hover:text-white transition">
                Forgot password?
              </a>
            </div>

            {/* Button */}
            <Button
              type="submit"
              className="w-full py-3 
              text-black 
              font-semibold 
              rounded-lg 
              hover:bg-white/10 
              transition-all duration-300"
            >
              Login
            </Button>

            {/* Signup */}
            <div className="text-center text-sm text-white/60">
              Don’t have an account?{' '}
              <a href="#" className="text-white hover:underline">
                Sign up
              </a>
            </div>

          </form>

          {message && (
            <p className="mt-6 text-center text-sm text-white/80">
              {message}
            </p>
          )}
        </motion.div>

        <p className="mt-10 text-white/40 text-sm">
          © {new Date().getFullYear()} DHANOMI HealthCare.AI
        </p>

      </div>
    </div>
  );
}
