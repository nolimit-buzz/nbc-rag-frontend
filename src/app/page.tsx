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
          <button className="bg-[#48B85C] text-white font-semibold px-5 py-2 rounded-lg shadow hover:bg-[#36994a] transition">Request Demo</button>
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
          <div className="flex items-center my-6 w-full">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="mx-4 text-gray-400 text-xs">Or sign in with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="flex gap-4 w-full justify-center mb-4">
            <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 hover:border-[#48B85C] transition w-full justify-center">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><g><path d="M19.6 10.23c0-.68-.06-1.36-.18-2.02H10v3.82h5.42a4.63 4.63 0 0 1-2 3.04v2.52h3.22c1.89-1.74 2.96-4.3 2.96-7.36z" fill="#4285F4"/><path d="M10 20c2.7 0 4.97-.9 6.63-2.44l-3.22-2.52c-.89.6-2.02.96-3.41.96-2.62 0-4.84-1.77-5.63-4.15H1.05v2.6A9.99 9.99 0 0 0 10 20z" fill="#34A853"/><path d="M4.37 11.85A5.99 5.99 0 0 1 4 10c0-.64.11-1.27.3-1.85V5.55H1.05A9.99 9.99 0 0 0 0 10c0 1.64.39 3.19 1.05 4.45l3.32-2.6z" fill="#FBBC05"/><path d="M10 4.01c1.47 0 2.78.51 3.81 1.5l2.85-2.85C14.97 1.13 12.7.01 10 .01A9.99 9.99 0 0 0 1.05 5.55l3.32 2.6C5.16 5.78 7.38 4.01 10 4.01z" fill="#EA4335"/></g></svg>
              <span className="text-gray-700 text-sm font-medium">Google</span>
            </button>
            <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 hover:border-[#48B85C] transition w-full justify-center">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><g><rect width="20" height="20" rx="4" fill="#000"/><path d="M15.83 10.18c0-2.7-2.19-4.89-4.89-4.89-2.7 0-4.89 2.19-4.89 4.89 0 2.7 2.19 4.89 4.89 4.89 2.7 0 4.89-2.19 4.89-4.89zm-4.89 3.89a3.89 3.89 0 1 1 0-7.78 3.89 3.89 0 0 1 0 7.78z" fill="#fff"/></g></svg>
              <span className="text-gray-700 text-sm font-medium">Apple ID</span>
            </button>
            <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 bg-gray-50 hover:border-[#48B85C] transition w-full justify-center">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><g><circle cx="10" cy="10" r="10" fill="#1877F2"/><path d="M13.5 10.5h-2v5h-2v-5H7V9h2V7.5c0-1.1.9-2 2-2h2v2h-2c-.28 0-.5.22-.5.5V9h2l-.5 1.5z" fill="#fff"/></g></svg>
              <span className="text-gray-700 text-sm font-medium">Facebook</span>
            </button>
          </div>
          <div className="text-center text-xs text-gray-400 mt-2">
            Don’t have an account? <Link href="/auth/register" className="text-[#48B85C] font-medium hover:underline">Register Now</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
