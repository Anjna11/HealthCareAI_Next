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
        setMessage('✅ Login successful!');
        setTimeout(() => {
          router.push('/home');
        }, 800);
      } else {
        setMessage('❌ Invalid email or password');
      }
    } catch (error) {
      console.error(error);
      setMessage('⚠️ Error connecting to server');
    }
  };

  // ✨ Animation variants
  const container = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
        when: 'beforeChildren',
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div className="flex min-h-screen">
      {/* Right side (Form Section) */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-[#FAFAFA] px-10 py-16">
        <motion.div
          className="flex items-center gap-2 mb-8 text-[#0E1A36]"
          variants={item}
          initial="hidden"
          animate="visible"
        >
          <HeartPulse className="w-7 h-7 text-[#F87B1B]" />
          <h1
            className="text-3xl font-extrabold tracking-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            DHANOMI
          </h1>
        </motion.div>

        <motion.div
          className="w-full max-w-md"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {/* Heading */}
          <motion.div variants={item}>
            <h2
              className="text-3xl font-semibold text-[#0E1A36]"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Welcome Back
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Please enter your login details to continue.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form className="space-y-5" onSubmit={handleSubmit} variants={item}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmit(e);
                }}
                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F87B1B] text-gray-900"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmit(e);
                }}
                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#F87B1B] text-gray-900"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-[#F87B1B]" />
                Remember me
              </label>
              <a href="#" className="text-[#F87B1B] hover:underline">
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#0E1A36] hover:bg-[#1B2B57] text-white font-semibold py-2 transition-all"
            >
              Login
            </Button>

            <div className="text-center text-sm text-gray-500">
              Don’t have an account?{' '}
              <a href="#" className="text-[#F87B1B] hover:underline">
                Sign up
              </a>
            </div>
          </motion.form>

          {/* Message */}
          {message && (
            <motion.p
              className={`mt-4 text-center font-medium ${
                message.includes('successful')
                  ? 'text-green-600'
                  : 'text-red-500'
              }`}
              variants={item}
            >
              {message}
            </motion.p>
          )}
        </motion.div>

        <motion.p
          className="text-center text-sm text-gray-400 mt-10"
          style={{ fontFamily: "'Inter', sans-serif" }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          © {new Date().getFullYear()} DHANOMI HealthCare.AI
        </motion.p>
      </div>

      <div className="hidden md:flex w-1/2 bg-[#0E1A36] text-white items-center justify-center p-10 relative overflow-hidden">
  {/* 🔮 Shimmer Animated Background */}
  <motion.div
    className="absolute inset-0 bg-gradient-to-br from-[#0E1A36] via-[#14254D] to-[#0E1A36] opacity-60"
    animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
    transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
    style={{
      backgroundSize: '400% 400%', // important for the shimmer movement
      zIndex: 0,
    }}
  />

  {/* Illustration + Text */}
  <div className="max-w-md text-center relative z-10">
    <motion.img
      src="/login-illustration.svg"
      alt="Healthcare illustration"
      className="mx-auto mb-6 w-80"
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    />

    <motion.h3
      className="text-3xl font-extrabold mb-3 text-white tracking-wide"
      style={{ fontFamily: "'Poppins', sans-serif" }}
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    >
      Healing the Future with Intelligence
    </motion.h3>

    <motion.p
  className="text-gray-200 text-[17px] leading-relaxed tracking-wide max-w-lg mx-auto mt-6 text-center"
  style={{ fontFamily: "'Inter', sans-serif", lineHeight: '1.9' }}
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5, duration: 1.3, ease: 'easeOut' }}
>
  At <span className="text-[#F87B1B] font-semibold">Dhanomi HealthCare.AI</span>, 
  innovation meets empathy. We blend advanced artificial intelligence with human insight 
  to empower doctors, enhance patient outcomes, and redefine personalized care.
  <span className="block mt-4 text-gray-300 font-medium">
    Smarter diagnostics. Seamless connections. Compassion, reimagined through technology.
  </span>
</motion.p>

  </div>
</div>

    </div>
  );
}
