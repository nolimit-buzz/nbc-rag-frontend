import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';

const menuItems = [
  'Dashboard',
  'Resources',
  'Settings',
];

interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
}

function getInitials(user: User | null) {
  if (!user) return 'U';
  if (user.firstName && user.lastName) return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  if (user.firstName) return user.firstName[0].toUpperCase();
  if (user.email) return user.email[0].toUpperCase();
  return 'U';
}

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch {
          setUser(null);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsDropdownOpen(false);
    // Redirect to login page or home page
    window.location.href = '/';
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.profile-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <nav className="top-0 left-0 right-0 z-30 h-26 bg-gray-50 shadow-sm flex items-center px-8">
      <Link href="/">
        <div className="flex items-center gap-2 mr-32">
          <Image src="/logo.svg" alt="DigiCred Logo" width={120} height={100} className="w-40 h-auto" />
        </div>
      </Link>
      <div className="flex gap-10 text-gray-700 font-medium text-sm relative">
        {menuItems.map((item) => (
          <motion.div
            key={item}
            className="relative flex items-center cursor-pointer"
            onClick={() => setActiveMenu(item)}
            whileHover={{ scale: 1.08, color: '#48B85C' }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            {activeMenu === item && (
              <span className="absolute -left-3 w-1 h-1 rounded-full bg-[#48B85C]" />
            )}
            <Link
              href={item === 'Dashboard' ? '/dashboard' : item.toLowerCase()}
              className={`transition ${activeMenu === item ? 'text-[#48B85C] font-semibold' : ''}`}
            >
              {item}
            </Link>
          </motion.div>
        ))}
      </div>
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Search for an NBC Paper by Name..."
          className="w-[340px] rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#48B85C]"
        />
      </div>
      <div className="flex items-center gap-4 ml-8">
        <span className="text-gray-700 text-sm">
          {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Guest'}
        </span>
        <div className="profile-dropdown relative">
          <motion.div 
            className="w-9 h-9 rounded-full bg-[#48B85C] flex items-center justify-center text-lg font-extrabold text-white cursor-pointer"
            onClick={toggleDropdown}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {getInitials(user)}
          </motion.div>
          
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            >
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Guest'}
                </p>
                <p className="text-xs text-gray-500">{user?.email || 'guest@example.com'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
              >
                <div className="flex items-center gap-2 cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </div>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
} 