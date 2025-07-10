"use client";
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${baseUrl}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          role: 'USER',
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Registration failed');
      }
      const data = await res.json();
      // Save tokens and user to localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      {/* Floating Images */}
      <Image src="/login-image-1.svg" alt="Floating 1" width={180} height={180} className="hidden md:block absolute top-10 left-10 z-0 opacity-80 animate-float-slow" />
      <Image src="/login-image-2.svg" alt="Floating 2" width={140} height={140} className="hidden md:block absolute top-1/2 left-0 z-0 opacity-70 animate-float" style={{transform: 'translateY(-50%)'}} />
      <Image src="/login-image-3.svg" alt="Floating 3" width={160} height={160} className="hidden md:block absolute bottom-10 left-24 z-0 opacity-80 animate-float-reverse" />
      <Image src="/login-image-4.svg" alt="Floating 4" width={170} height={170} className="hidden md:block absolute top-20 right-10 z-0 opacity-70 animate-float" />
      <Image src="/login-image-5.svg" alt="Floating 5" width={130} height={130} className="hidden md:block absolute bottom-16 right-24 z-0 opacity-60 animate-float-slow" />

      {/* Top Bar */}
      <header className="flex items-center justify-between px-8 py-6 relative z-10">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="DigiCred Logo" width={120} height={40} className="w-40 h-auto" />
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-700 font-medium hover:text-[#48B85C] transition">Login</Link>
          <button className="bg-[#48B85C] text-white font-semibold px-5 py-2 rounded-lg shadow hover:bg-[#36994a] transition">Request Demo</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center relative z-10">
        <div className="bg-white rounded-3xl shadow-xl px-10 py-12 w-full max-w-md flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Register</h1>
          <p className="text-gray-500 mb-8 text-center">Create your account to get started</p>
          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="First Name"
                className="w-1/2 px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:border-[#48B85C]"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-1/2 px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:border-[#48B85C]"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:border-[#48B85C]"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:border-[#48B85C]"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-[#48B85C]"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {/* Hidden role field */}
            <input type="hidden" value="USER" name="role" />
            <button
              type="submit"
              className="w-full bg-[#48B85C] hover:bg-[#36994a] text-white font-semibold py-3 rounded-lg transition mb-2 shadow disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
            {error && <div className="text-red-500 text-xs text-center mt-1">{error}</div>}
            {success && <div className="text-green-600 text-xs text-center mt-1">{success}</div>}
          </form>
          <div className="text-center text-xs text-gray-400 mt-2">
            Already have an account? <Link href="/" className="text-[#48B85C] font-medium hover:underline">Login</Link>
          </div>
        </div>
      </main>
    </div>
  );
} 