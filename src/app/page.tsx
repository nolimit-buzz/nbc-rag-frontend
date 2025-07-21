'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${baseUrl}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Login failed');
      }
      const data = await res.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="DigiCred Logo" width={120} height={40} className="w-40 h-auto" />
        </div>
        <div className="flex items-center gap-4">
          <button className="text-gray-700 font-medium hover:text-[#48B85C] transition">Sign up</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl px-10 py-12 w-full max-w-md flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-2 text-gray-900">Login</h1>
          <p className="text-gray-500 mb-8 text-center">Enter your details to sign in to your account</p>
          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter Email"
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
            <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
              <span>Having trouble signing in?</span>
            </div>
            <button
              type="submit"
              className="w-full bg-[#48B85C] hover:bg-[#36994a] text-white font-semibold py-3 rounded-lg transition mb-2 shadow disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            {error && <div className="text-red-500 text-xs text-center mt-1">{error}</div>}
          </form>
          <div className="text-center text-xs text-gray-400 mt-2">
            Don’t have an account? <Link href="/auth/register" className="text-[#48B85C] font-medium hover:underline">Register Now</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
